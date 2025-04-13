<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\StoreOrderItemsRequest;
use App\Http\Requests\UpdateOrderItemsRequest;
use App\Http\Resources\OrderItemsResource;
use App\Interfaces\OrderItemsRepositoryInterface;
use DB;
use Illuminate\Http\Request;

class OrderItemsController extends Controller
{
    private OrderItemsRepositoryInterface $orderItemsRepository;

    public function __construct(OrderItemsRepositoryInterface $orderItemsRepository)
    {
        $this->orderItemsRepository = $orderItemsRepository;
    }

    // get all orders
    public function index()
    {
        $orderItems = $this->orderItemsRepository->index();
        return ApiResponseClass::sendResponse(OrderItemsResource::collection($orderItems),'',200);
    }

    // get order by id
    public function show($id)
    {
        $orderItem = $this->orderItemsRepository->getById($id);
        return ApiResponseClass::sendResponse(new OrderItemsResource($orderItem),'',200);
    }

    // store orderItems
    public function store(StoreOrderItemsRequest $request)
    {
        $details = [
            'order_id' => $request->order_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'price' => $request->price
        ];

        DB::beginTransaction();
        try {
            $orderItems = $this->orderItemsRepository->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new OrderItemsResource($orderItems),'',200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // update orderItems
    public function update(UpdateOrderItemsRequest $request, $id)
    {
        $updateDetails = [
            'order_id' => $request->order_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'price' => $request->price
        ];

        DB::beginTransaction();
        try{
            $orderItems = $this->orderItemsRepository->update($updateDetails, $id);
            DB::commit();
            return ApiResponseClass::sendResponse('OrderItems Update Successful','',201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // delete orderItems
    public function destroy($id)
    {
        $orderItems = $this->orderItemsRepository->delete( $id );
        return ApiResponseClass::sendResponse('OrderItems Delete Successful','',200);
    }
}
