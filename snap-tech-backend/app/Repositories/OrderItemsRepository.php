<?php

namespace App\Repositories;

use App\Models\OrderItem;

class OrderItemsRepository
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function index(){
        return OrderItem::all();
    }

    public function getById($id){
       return OrderItem::findOrFail($id);
    }

    public function store(array $data){
       return OrderItem::create($data);
    }

    public function update(array $data,$id){
       return OrderItem::whereId($id)->update($data);
    }
    
    public function delete($id){
       OrderItem::destroy($id);
    }
}
