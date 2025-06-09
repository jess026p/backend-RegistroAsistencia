import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('geocoding')
export class GeocodingController {
  @Get('reverse')
  async reverseGeocode(@Query('lat') lat: string, @Query('lon') lon: string) {
    if (!lat || !lon) {
      return { error: 'Parámetros lat y lon son requeridos' };
    }
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'YaviracApp/1.0' }
      });
      console.log('Respuesta Nominatim:', response.data);
      return response.data;
    } catch (error) {
      return { error: 'No se pudo obtener la dirección', details: error.message };
    }
  }

  @Get('search')
  async searchAddress(@Query('q') q: string) {
    if (!q) {
      return { error: 'Parámetro q es requerido' };
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'YaviracApp/1.0' }
      });
      return response.data;
    } catch (error) {
      return { error: 'No se pudo buscar la dirección', details: error.message };
    }
  }
} 