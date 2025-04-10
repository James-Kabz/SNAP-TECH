<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use DB;
use Illuminate\Http\Request;
use App\Interfaces\PermissionRepositoryInterface;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{

    private PermissionRepositoryInterface $permissionRepositoryInterface;

    public function __construct(PermissionRepositoryInterface $permissionRepositoryInterface)
    {
        $this->permissionRepositoryInterface = $permissionRepositoryInterface;
    }

    // get permissions
    public function index()
    {
        $data = $this->permissionRepositoryInterface->index();

        return ApiResponseClass::sendResponse(PermissionResource::collection($data),'',200);
    }

    // get permission by id
    public function show($id)
    {
        $permission = $this->permissionRepositoryInterface->getById($id);

        return ApiResponseClass::sendResponse(new PermissionResource($permission),'',200);
    }

    // store permission
    public function store(StorePermissionRequest $request)
    {
        $details =[
            'name' => $request->name,
        ];

        DB::beginTransaction();
        try{
            $permission = $this->permissionRepositoryInterface->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new PermissionResource($permission),'',200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // update permission 

    public function update(UpdatePermissionRequest $request, $id)
    {
        $updateDetails = [
            'name' => $request->name,
        ];

        DB::beginTransaction();
        try{
            $permission = $this->permissionRepositoryInterface->update($updateDetails,$id);
            DB::commit();
            return ApiResponseClass::sendResponse('Permission Update Successful','',201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
        
    }

    // delete permission

    public function destroy($id)
    {
        $this->permissionRepositoryInterface->delete($id);

        return ApiResponseClass::sendResponse('Permission Delete Successful','',200);
    }

}
