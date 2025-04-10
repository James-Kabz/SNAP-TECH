<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\AddPermissionToRoleRequest;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Interfaces\RoleRepositoryInterface;
use DB;
use Illuminate\Http\Request;

class RoleController extends Controller
{

    private RoleRepositoryInterface $roleRepositoryInterface;

    public function __construct(RoleRepositoryInterface $roleRepositoryInterface)
    {
        $this->roleRepositoryInterface = $roleRepositoryInterface;
    }

    // get all roles
    public function index()
    {
        $data = $this->roleRepositoryInterface->index();

        return ApiResponseClass::sendResponse(RoleResource::collection($data), '', 200);
    }

    // get role by id
    public function show($id)
    {
        $role = $this->roleRepositoryInterface->getById($id);

        return ApiResponseClass::sendResponse(new RoleResource($role), '', 200);
    }

    // create role
    public function store(StoreRoleRequest $request)
    {
        $details = [
            'name' => $request->name,
        ];

        DB::beginTransaction();
        try {
            $role = $this->roleRepositoryInterface->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new RoleResource($role), '', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // update role
    public function update(UpdateRoleRequest $request, $id)
    {
        $updateDetails = [
            'name' => $request->name,
        ];

        DB::beginTransaction();
        try {
            $role = $this->roleRepositoryInterface->update($updateDetails, $id);

            DB::commit();
            return ApiResponseClass::sendResponse('Role Update Successful', 201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // delete role
    public function destroy($id)
    {
        $this->roleRepositoryInterface->delete($id);

        return ApiResponseClass::sendResponse('Role Delete Successful', '', 200);
    }


    // role permissions
    public function getRolePermissions($roleId)
    {
        try {
            $role = $this->roleRepositoryInterface->getById($roleId);
            $permissions = $role->permissions->pluck('name'); // or 'name'

            return ApiResponseClass::sendResponse($permissions, 'Role permissions fetched successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    public function syncPermissionToRole(AddPermissionToRoleRequest $request, $roleId)
    {
        try {
            $permissions = $request->permissions;
            $syncedPermissions = $this->roleRepositoryInterface->syncPermissionsToRole($roleId, $permissions);

            return ApiResponseClass::sendResponse('Role Permissions Synced Successfully', $syncedPermissions, 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

}
