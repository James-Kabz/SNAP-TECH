<?php

namespace App\Repositories;

use App\Interfaces\OrderRepositoryInterface;
use App\Models\Order;

class OrderRepository implements OrderRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function index(){
        return Order::all();
    }

    public function getById($id){
       return Order::findOrFail($id);
    }

    public function store(array $data){
       return Order::create($data);
    }

    public function update(array $data,$id){
       return Order::whereId($id)->update($data);
    }
    
    public function delete($id){
       Order::destroy($id);
    }
}
