import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };

  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again" });
  }

  orderInfo.email = req.user.email;

  try {
    const lastOrder = await Order.find().sort({ orderDate: -1 }).limit(1);

    if (lastOrder.length == 0) {
      orderInfo.orderId = "ORD0001";
    } else {
      const lastOrderId = lastOrder[0].orderId; // ORD0065
      const lastOrderNumberString = lastOrderId.replace("ORD", ""); // 0065
      const lastOrderNumber = parseInt(lastOrderNumberString, 10); // 65
      const currentOrderNumber = lastOrderNumber + 1; // 66
      const formattedNumber = String(currentOrderNumber).padStart(4, "0"); // "0066"
      orderInfo.orderId = "ORD" + formattedNumber;
    }

    let oneDayCost = 0;
    for (let i = 0; i < data.orderedItems.length; i++) {
      try {
        const product = await Product.findOne({
          key: data.orderedItems[i].key,
        });

        if (!product) {
          return res.status(404).json({
            message: `Product with key ${data.orderedItems[i].key} not found`,
          });
        }

        if (!product.availability) {
          return res.status(400).json({
            message: `Product with key ${data.orderedItems[i].key} is not available`,
          });
        }

        orderInfo.orderedItems.push({
          product: {
            key: product.key,
            name: product.name,
            image: product.image[0],
            price: product.price,
          },
          quantity: data.orderedItems[i].qty,
        });

        oneDayCost += product.price * data.orderedItems[i].qty;

        // orderInfo.orderedItems.push({
        //   product: product.key,
        //   name: product.name,
        //   image: product.image[0],
        //   price: product.price,
        //   quantity: data.orderedItems[i].quantity, // ✅ Fixed quantity placement
        // });

        // oneDayCost += product.price * data.orderedItems[i].quantity;
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create order" });
      }
    }

    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate; // ✅ Fixed field name
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days;

    const newOrder = new Order(orderInfo);
    const result = await newOrder.save();

    res.json({ message: "Order created successfully", order: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
}
export async function getQuote(req, res) {
  console.log(req.body);
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };

  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again" });
  }

  let oneDayCost = 0;
  for (let i = 0; i < data.orderedItems.length; i++) {
    try {
      const product = await Product.findOne({
        key: data.orderedItems[i].key,
      });

      if (!product) {
        return res.status(404).json({
          message: `Product with key ${data.orderedItems[i].key} not found`,
        });
      }

      if (!product.availability) {
        return res.status(400).json({
          message: `Product with key ${data.orderedItems[i].key} is not available`,
        });
      }

      orderInfo.orderedItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.image[0],
          price: product.price,
        },
        quantity: data.orderedItems[i].qty,
      });

      oneDayCost += product.price * data.orderedItems[i].qty;

      // orderInfo.orderedItems.push({
      //   product: product.key,
      //   name: product.name,
      //   image: product.image[0],
      //   price: product.price,
      //   quantity: data.orderedItems[i].quantity, // ✅ Fixed quantity placement
      // });

      // oneDayCost += product.price * data.orderedItems[i].quantity;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create order" });
    }
  }

  orderInfo.days = data.days;
  orderInfo.startingDate = data.startingDate; // ✅ Fixed field name
  orderInfo.endingDate = data.endingDate;
  orderInfo.totalAmount = oneDayCost * data.days;

  try {
    res.json({
      message: "Order quatation",
      total: orderInfo.totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
}
