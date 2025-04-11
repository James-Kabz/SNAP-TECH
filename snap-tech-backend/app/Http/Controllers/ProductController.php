<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Interfaces\ProductRepositoryInterface;
use DB;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private ProductRepositoryInterface $productRepositoryInterface;

    public function __construct(ProductRepositoryInterface $productRepositoryInterface)
    {
        $this->productRepositoryInterface = $productRepositoryInterface;
    }
    // get all products
    public function index()
    {
        $products = $this->productRepositoryInterface->index();

        return ApiResponseClass::sendResponse(CategoryResource::collection($products),'',200);
    }

    // get product by id
    public function show($id)
    {
        $product = $this->productRepositoryInterface->getById($id);

        return ApiResponseClass::sendResponse(new ProductResource($product),'',200);
    }

    // store product
    public function store(StoreProductRequest $request)
    {
        $details = [
            'name' => $request->name,
            'description' => $request->description,
            'price'=> $request->price,
            'stock'=> $request->stock,
            'image_url' => $request->image_url,
            'category_id'=> $request->category_id,
        ];

        DB::beginTransaction();
        try {
            $product = $this->productRepositoryInterface->store($details);

            DB::commit();
            return ApiResponseClass::sendResponse(new ProductResource($product),'',200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // update product
    public function update(UpdateProductRequest $request, $id)
    {
        $updateDetails = [
            'name' => $request->name,
            'description' => $request->description,
            'price'=> $request->price,
            'stock'=> $request->stock,
            'image_url' => $request->image_url,
            'category_id'=> $request->category_id,
        ];

        DB::beginTransaction();
        try {
            $product = $this->productRepositoryInterface->update($updateDetails,$id);

            DB::commit();
            return ApiResponseClass::sendResponse('Product Update Successful','',200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // delete product
    public function destroy($id)
    {
        $this->productRepositoryInterface->delete($id);
        return ApiResponseClass::sendResponse('Product Delete Successful','',200);
    }
}
