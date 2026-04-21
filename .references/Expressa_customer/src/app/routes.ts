import { createBrowserRouter } from "react-router";
import { Shell } from "./components/Shell";
import { MenuRoot } from "./components/screens/MenuRoot";
import { MenuGroup } from "./components/screens/MenuGroup";
import { ProductDetail } from "./components/screens/ProductDetail";
import { Cart } from "./components/screens/Cart";
import { SlotPicker } from "./components/screens/SlotPicker";
import { OrdersHistory } from "./components/screens/OrdersHistory";
import { Auth } from "./components/screens/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Shell,
    children: [
      { index: true, Component: MenuRoot },
      { path: ":group", Component: MenuGroup },
      { path: ":group/item/:item", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "order/slot", Component: SlotPicker },
      { path: "orders", Component: OrdersHistory },
      { path: "auth", Component: Auth },
    ],
  },
]);
