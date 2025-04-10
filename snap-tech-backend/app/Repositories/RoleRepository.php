<?php

namespace App\Repositories;

use App\Interfaces\RoleRepositoryInterface;
use Spatie\Permission\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    public function index(){
        return Role::all();
    }

    public function getById($id){
       return Role::findOrFail($id);
    }

    public function store(array $data){
       return Role::create($data);
    }

    public function update(array $data,$id){
       return Role::whereId($id)->update($data);
    }
    
    public function delete($id){
       Role::destroy($id);
    }

   //  role permissions
   public function addPermissionToRole($roleId, array $permissions)
   {
      $role = Role::findOrFail($roleId);

      foreach ($permissions as $permission) {
         $role->givePermissionTo($permission);
      }

      return $role->permissions;
   }

   public function syncPermissionsToRole($roleId, array $permissions)
   {
      $role = Role::findOrFail($roleId);

      $role->syncPermissions($permissions);

      return $role->permissions;
   }

   public function getRolePermissions($roleId) 
   {
      $role = Role::findOrFail($roleId);

      return $role->permissions;
   }
}
