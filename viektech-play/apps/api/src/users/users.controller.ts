import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy
    return this.usersService.findById(req.user.userId);
  }

  @Patch("me")
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Get("me/stats")
  getStats(@Request() req) {
    return this.usersService.getStats(req.user.userId);
  }

  // Admin endpoints for user management
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getUserById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteUser(@Param("id") id: string, @Request() req) {
    // Prevent self-deletion
    if (req.user.userId === id) {
      throw new ForbiddenException("Cannot delete your own account");
    }
    return this.usersService.delete(id);
  }
  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateUserAsAdmin(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Admin can update other users' displayName and email
    return this.usersService.update(id, updateUserDto);
  }
}
