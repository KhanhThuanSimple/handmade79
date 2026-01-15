import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/model';
import api from '../services/api';
import { useNotify } from '../components/NotificationContext';

interface CartContextType {
    cartCount: number;
    refreshCart: () => void;
    addToCart: (product: any) => void;
    mergeCart: (userId: string | number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Sử dụng chung 1 key duy nhất để dễ quản lý
const CART_STORAGE_KEY = 'userCart';

export const CartProvider = ({ children, currentUser }: { children: ReactNode, currentUser: User | null }) => {
    const [cartCount, setCartCount] = useState(0);
    const notify = useNotify();

    // 1. Refresh chỉ đọc từ LocalStorage
    const refreshCart = () => {
        const localData = localStorage.getItem(CART_STORAGE_KEY);
        const items = localData ? JSON.parse(localData) : [];
        setCartCount(items.length);
    };

    // 2. AddToCart luôn luôn lưu vào LocalStorage
    const addToCart = (product: any) => {
        if (!product || product.inventory <= 0) {
            notify.warning("Sản phẩm đã hết hàng!");
            return;
        }

        const localData = localStorage.getItem(CART_STORAGE_KEY);
        let items = localData ? JSON.parse(localData) : [];

        const existingItem = items.find((i: any) => i.productId === product.id);
        
        if (existingItem) {
            items = items.map((i: any) =>
                i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            items.push({ 
                productId: product.id, 
                name: product.name, 
                price: product.price, 
                imageUrl: product.imageUrl,
                quantity: 1 
            });
        }

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        refreshCart();
        notify.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    };

    // 3. Hàm gộp giỏ hàng (Gọi sau khi Login thành công)
    const mergeCart = async (userId: string | number) => {
        const localData = localStorage.getItem(CART_STORAGE_KEY);
        if (!localData) return;

        const guestItems = JSON.parse(localData);
        if (guestItems.length === 0) return;

        try {
            // Lấy giỏ hàng hiện có trên Firebase của User
            const res = await api.get('/carts', {
                params: {
                    orderBy: '"userId"',
                    equalTo: userId
                }
            });

            let userCart = null;
            let cartFirebaseKey = null;

            if (res.data && Object.keys(res.data).length > 0) {
                cartFirebaseKey = Object.keys(res.data)[0];
                userCart = res.data[cartFirebaseKey];
            }

            if (!userCart) {
                // Nếu server chưa có giỏ hàng, POST mới
                await api.post('/carts', { userId, items: guestItems });
            } else {
                // Nếu đã có, tiến hành gộp dữ liệu
                let finalItems = [...(userCart.items || [])];
                guestItems.forEach((gItem: any) => {
                    const exist = finalItems.find(i => i.productId === gItem.productId);
                    if (exist) {
                        exist.quantity += gItem.quantity;
                    } else {
                        finalItems.push(gItem);
                    }
                });
                // Cập nhật lên Firebase
                await api.patch(`/carts/${cartFirebaseKey}`, { items: finalItems });
                
                // Sau khi gộp xong, cập nhật lại LocalStorage để đồng bộ dữ liệu mới nhất từ Server về máy
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(finalItems));
            }
            refreshCart();
        } catch (err) {
            console.error("Lỗi gộp giỏ hàng:", err);
            notify.error("Không thể đồng bộ giỏ hàng với máy chủ");
        }
    };

    // Theo dõi trạng thái đăng nhập để refresh lại số lượng Badge
    useEffect(() => {
        refreshCart();
    }, [currentUser]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, addToCart, mergeCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};