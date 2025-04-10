<?php

namespace App\Repositories;

use App\Interfaces\PermissionRepositoryInterface;
use Spatie\Permission\Models\Permission;

class PermissionRepository implements PermissionRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function index(){
        return Permission::all();
    }

    public function getById($id){
       return Permission::findOrFail($id);
    }

    public function store(array $data){
       return Permission::create($data);
    }

    public function update(array $data,$id){
       return Permission::whereId($id)->update($data);
    }
    
    public function delete($id){
       Permission::destroy($id);
    }
}
