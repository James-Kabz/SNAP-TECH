<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // get all products
    public function index()
    {
        //    
    }

    // get product by id
    public function getById($id)
    {
        //
    }

    // store product
    public function store(StoreProductRequest $request)
    {
        //
    }

    // update product
    public function update(UpdateProductRequest $request, $id)
    {
        //
    }

    // delete product
    public function destroy($id)
    {
        //
    }
}
