<?php

namespace App\Repositories;

use App\Interfaces\OrderItemsRepositoryInterface;
use App\Models\OrderItem;
use App\Models\Product;

class OrderItemsRepository implements OrderItemsRepositoryInterface
{
   /**
    * Create a new class instance.
    */
   public function __construct()
   {
      //
   }

   public function index()
   {
      return OrderItem::all();
   }

   public function getById($id)
   {
      return OrderItem::findOrFail($id);
   }

   public function store(array $data)
   {

      $product = Product::findOrFail($data["product_id"]);

      if ($product->stock < $data["quantity"]) {
         throw new \Exception('Not enough stock available for this product');
      }
      ;

      $orderItem = OrderItem::create($data);

      $product->stock -= $data["quantity"];

      $product->save();
      return $orderItem;
   }

   public function update(array $data, $id)
   {
      // Get the current order item
      $orderItem = OrderItem::findOrFail($id);

      // If quantity is being updated
      if (isset($data['quantity']) && $data['quantity'] != $orderItem->quantity) {
         // Get the product
         $product = Product::findOrFail($orderItem->product_id);

         // Calculate the difference in quantity
         $quantityDifference = $data['quantity'] - $orderItem->quantity;

         // If increasing quantity, check if enough stock is available
         if ($quantityDifference > 0 && $product->stock < $quantityDifference) {
            throw new \Exception('Not enough stock available for this product');
         }

         // Update the product stock
         $product->stock -= $quantityDifference;
         $product->save();
      }

      // Update the order item
      $orderItem->update($data);

      return $orderItem;
   }
   public function delete($id)
   {
      OrderItem::destroy($id);
   }
}
