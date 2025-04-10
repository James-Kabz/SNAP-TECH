<?php

namespace App\Interfaces;

interface RoleRepositoryInterface
{
    public function index();
    public function getById($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    // role permissions
    public function addPermissionToRole($roleId, array $permissions);
    public function syncPermissionsToRole($roleId, array $permissions);

    public function getRolePermissions($roleId);

}
