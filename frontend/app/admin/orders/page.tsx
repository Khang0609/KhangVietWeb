// @/app/admin/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Package,
  Calendar,
  User,
  Phone,
  CircleDollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiUrl } from "@/lib/api";

// --- TYPE DEFINITIONS BASED ON BACKEND ---
interface OrderItem {
  product_name: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  _id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note?: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "processing" | "ready" | "completed";
  created_at: string; // Comes as ISO string
}

// --- HELPER FUNCTIONS ---

// Function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Mapping for status translation and styling
const statusConfig = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-yellow-900/30 text-yellow-400 border border-yellow-600/50",
  },
  processing: {
    label: "Đang xử lý",
    className: "bg-blue-900/30 text-blue-400 border border-blue-600/50",
  },
  ready: {
    label: "Sẵn sàng",
    className: "bg-purple-900/30 text-purple-400 border border-purple-600/50",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-green-900/30 text-green-400 border border-green-600/50",
  },
};

const getStatusBadge = (status: Order["status"]) => {
  const config = statusConfig[status] || {
    label: "Không xác định",
    className: "bg-gray-700 text-gray-300",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

// --- MAIN COMPONENT ---

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchOrders = async () => {
      const baseUrl = getApiUrl();
      console.log(baseUrl); 
      try {
        const response = await fetch(`${baseUrl}/orders`, {
          cache: "no-store",
        });
        // const response = await res.json();
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Here you might want to set an error state and display a message
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (newStatus: Order["status"]) => {
    if (!selectedOrder) return;
    // TODO: Implement API call to PATCH /orders/{order_id} to update status
    console.log(`Updating order ${selectedOrder._id} to ${newStatus}`);

    // Optimistic UI update
    setOrders(
      orders.map((o) =>
        o._id === selectedOrder._id ? { ...o, status: newStatus } : o
      )
    );
    setIsModalOpen(false);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "newest"
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });
  console.log(sortedOrders)
  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <Select
          value={sortOrder}
          onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}
        >
          <SelectTrigger className="w-[180px] bg-[#1E1E1E] border-gray-700">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent className="bg-[#1E1E1E] text-white border-gray-700">
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full">
          <thead className="bg-[#0a0a0a] border-b border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Ngày tạo
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-800 hover:bg-[#252525] transition-colors text-sm"
              >
                <td className="px-4 py-2 text-gray-300">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium text-white">
                    {order.customer_name}
                  </div>
                  <div className="text-gray-400">{order.customer_phone}</div>
                </td>
                <td className="px-4 py-2 text-gray-300 max-w-xs">
                  {order.items
                    .map((item) => `${item.product_name} (x${item.quantity})`)
                    .join(", ")}
                </td>
                <td className="px-4 py-2 font-medium text-white">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="px-4 py-2">{getStatusBadge(order.status)}</td>
                <td className="px-4 py-2">
                  <Dialog
                    open={isModalOpen && selectedOrder?._id === order._id}
                    onOpenChange={(isOpen) => {
                      if (isOpen) {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                      } else {
                        setIsModalOpen(false);
                        setSelectedOrder(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#FF6B00] hover:text-[#FF8533]"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E1E1E] text-white border-gray-700 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-[#FF6B00]">
                          Cập nhật trạng thái đơn hàng
                        </DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="customer-name"
                              className="text-right text-gray-400"
                            >
                              Khách hàng
                            </Label>
                            <Input
                              id="customer-name"
                              value={selectedOrder.customer_name}
                              readOnly
                              className="col-span-3 bg-[#0a0a0a] border-gray-600"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="status-select"
                              className="text-right text-gray-400"
                            >
                              Trạng thái
                            </Label>
                            <Select
                              defaultValue={selectedOrder.status}
                              onValueChange={(value: Order["status"]) =>
                                handleUpdateStatus(value)
                              }
                            >
                              <SelectTrigger
                                id="status-select"
                                className="col-span-3 bg-[#0a0a0a] border-gray-600 focus:ring-[#FF6B00]"
                              >
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1E1E1E] text-white border-gray-700">
                                {Object.entries(statusConfig).map(
                                  ([key, { label }]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
