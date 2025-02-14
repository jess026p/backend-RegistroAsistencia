import { Injectable } from '@nestjs/common';
import { MenusService, RolesService } from '@auth/services';
import { CreateMenuDto } from '@auth/dto';
import { MenuTypeEnum, RoleEnum } from '@auth/enums';
import { PrimeIcons } from '@shared/enums';

@Injectable()
export class MenusSeeder {
  constructor(private menusService: MenusService, private rolesService: RolesService) {
  }

  async run() {
    await this.createMenus();
    await this.createMenuRole();
  }

  private async createMenus() {
    const menus: CreateMenuDto[] = [];

    menus.push(
      {
        code: 'manager_dashboard',
        icon: PrimeIcons.ADDRESS_BOOK,
        isVisible: true,
        label: 'Dashboard',
        routerLink: '/core/manager/dashboard',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: 'employees',
        icon: PrimeIcons.USERS,
        isVisible: true,
        label: 'Lista de Empleados',
        routerLink: '/core/manager/employees/list',
        order: 2,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: 'attendances',
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Asistencias',
        routerLink: '/core/manager/attendances/list',
        order: 3,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: 'schedules',
        icon: PrimeIcons.CALENDAR_CLOCK,
        isVisible: true,
        label: 'Horarios',
        routerLink: '/core/manager/schedules/list',
        order: 4,
        type: MenuTypeEnum.LEFT_SIDE,
      },
    );

    for (const menu of menus) {
      await this.menusService.create(menu);
    }
  }

  private async createMenuRole() {
    const menusAll = (await this.menusService.findAll()).data;

    const role = await this.rolesService.findByCode(RoleEnum.MANAGER);

    role.menus = menusAll.filter(menu =>
      menu.code === 'manager_dashboard' ||
      menu.code === 'employees' ||
      menu.code === 'attendances' ||
      menu.code === 'schedules',
    );

    await this.rolesService.createMenus(role);
  }
}