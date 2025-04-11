<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Interfaces\CategoryRepositoryInterface;
use App\Models\Category;
use DB;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    private CategoryRepositoryInterface $categoryRepositoryInterface;

    public function __construct(CategoryRepositoryInterface $categoryRepositoryInterface)
    {
        $this->categoryRepositoryInterface = $categoryRepositoryInterface;
    }
    // get all categories

    public function index()
    {
        $categories = $this->categoryRepositoryInterface->index();

        return ApiResponseClass::sendResponse(CategoryResource::collection($categories),'',200);
    }

    // get category by id

    public function show($id)
    {
        $category = $this->categoryRepositoryInterface->getById($id);

        return ApiResponseClass::sendResponse(new CategoryResource($category), '', 200);
    }

    // store category

    public function store(StoreCategoryRequest $request)
    {
        $details = [
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try {
            $category = $this->categoryRepositoryInterface->store($details);

            DB::commit();
            return ApiResponseClass::sendResponse(new CategoryResource($category), '', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // update category
    public function update(UpdateCategoryRequest $request, $id)
    {
        $updateDetails = [
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try {
            $category = $this->categoryRepositoryInterface->update($updateDetails, $id);
            DB::commit();
            return ApiResponseClass::sendResponse('Category Update Successfull','', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // delete category

    public function destroy($id)
    {
        $this->categoryRepositoryInterface->delete($id);
        return ApiResponseClass::sendResponse('Category Deleted Successfully','',200);
    }
}
