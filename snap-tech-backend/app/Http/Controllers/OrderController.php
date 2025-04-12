<?php

namespace App\Http\Controllers;

use App\Classes\ApiResponseClass;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PermissionResource;
use App\Interfaces\OrderRepositoryInterface;
use DB;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private OrderRepositoryInterface $orderRepositoryInterface;

    public function __construct(OrderRepositoryInterface $orderRepositoryInterface)
    {
        $this->orderRepositoryInterface = $orderRepositoryInterface;
    }

    // get orders
    public function index()
    {
        $orders = $this->orderRepositoryInterface->index();
        return ApiResponseClass::sendResponse(PermissionResource::collection( $orders),'', 200);
    }

    // get order by id
    public function show($id)
    {
        $order = $this->orderRepositoryInterface->getById($id);

        return ApiResponseClass::sendResponse( new OrderResource( $order ),'',200);
    }

    // store order
    public function store(StoreOrderRequest $request)
    {
        $details = [
            'user_id' => $request->user_id,
            'status' => $request->status,
            'total' => $request->total
        ];

        DB::beginTransaction();
        try {
            $orders = $this->orderRepositoryInterface->store($details);
            DB::commit();
            return ApiResponseClass::sendResponse(new OrderResource($orders),'',200);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback($e);
        }
    }

    // update order
    public function update(UpdateOrderRequest $request, $id)
    {
        $updateDetails = [
            'user_id' => $request->user_id,
            'status'=> $request->status,
            'total' => $request->total
        ];

        DB::beginTransaction();
        try{
            $order = $this->orderRepositoryInterface->update($updateDetails, $id);
            DB::commit();
            return ApiResponseClass::sendResponse('Order Update Successful','',201);
        } catch (\Exception $e) {
            return ApiResponseClass::rollback( $e);
        }
    }

    public function destroy($id)
    {
        $order = $this->orderRepositoryInterface->delete( $id );

        return ApiResponseClass::sendResponse('Order Delete Successful','',200);
    }
}
