package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ErrorCode;
import it.unipd.webapp.devicemanagement.exception.ForbiddenException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.*;
import it.unipd.webapp.devicemanagement.repository.*;

import it.unipd.webapp.devicemanagement.service.DeviceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderProductRepository orderProductRepo;

    @Autowired
    private DeviceService deviceService;

    // This method can be replaced by a Customer static method
    private Customer getLoggedCustomer() {
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // TODO: evaluate whether is useful to send also the order detail in the cart. If it's decided to remove order detail, the cart should return the products and the class CartDetail should be deleted
    /**
     * Gets the information of an order
     *
     * @return A response of CartDetail which wraps the order and the list of products associated
     * with that order
     */
    @GetMapping("/cartInfo")
    public ResponseEntity<CartDetail> cartInfo(){
        log.debug("getNotcompletedOrders");
        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get the unique not completed order
        Optional<OrderDetail> order = orderRepo.notcompletedOrders(customerId);

        // Here we store the information needed for the cart
        CartDetail cartDetail = new CartDetail();

        // Order does not exist, we want return an empty list of products
        if (order.isEmpty()) {
            List<OrderProduct> emptyOrderProduct = new ArrayList<>(); // We want to send an empty list of products
            cartDetail.setOrder(null);
            cartDetail.setOrderProducts(emptyOrderProduct);
            return ResponseEntity.ok().body(cartDetail);
        }

        List<OrderProduct> orderProducts = orderProductRepo.getByOrderId(order.get().getId());

        cartDetail.setOrder(order.get());
        cartDetail.setOrderProducts(orderProducts);

        return ResponseEntity.ok().body(cartDetail);
    }


    //Query List of all completed orders of customer with id=1234

    /**
     * Queries a list of all completed orders of customer.
     *
     * @return The completed order list
     */
    @GetMapping("/completedOrders")
    public ResponseEntity<List<OrderDetail>> completedOrders(){
        log.debug("getCompletedOrders");

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get the list of completed order of the user with id = customerId
        List<OrderDetail> orders = orderRepo.completedOrders(customerId);

        return ResponseEntity.ok().body(orders);
    }

    //Add product to cart

    /**
     * Adds the specified product to cart. The products in cart are the ones that are going to be bought by user
     *
     * @param productId The product's id to add in the cart
     * @return The response which shows the association between product and order. i.e. in which order the product is added
     * @throws ResourceNotFoundException When the product's id passed is doesn't exist
     */
    @PostMapping("/addProductToCart")
    public ResponseEntity<OrderProduct> addProductToCart(@RequestParam long productId) throws ResourceNotFoundException {
        log.debug("addProductToCart");

        // to execute this query we need get the product and the order(cart) entities.

        //get customerId
        long customerId = getLoggedCustomer().getId();

        //get non-complete order info (cart)
        //get the unique not completed order
        OrderDetail cart = orderRepo.notcompletedOrders(customerId).orElseGet(() -> {
            // if the there are no not-completed orders, create one
            OrderDetail orderToAdd = new OrderDetail();
            orderToAdd.setAddress("");
            orderToAdd.setCustomer(getLoggedCustomer());
            Date date = new Date();
            orderToAdd.setTimestamp(date);
            orderRepo.save(orderToAdd);
            return orderToAdd;
        });

        //get the product corresponding to the id given or return an error.
        Product prodData = productRepo.findById(productId).orElseThrow(() -> new ResourceNotFoundException("The product does not exists", ErrorCode.EPRD1));

        //check if the pair (order_id,product_id) already present in the orders_products table. (That mean there was already some quantity of that product in the cart)
        Optional<OrderProduct> ordprod = orderProductRepo.getQuantity(cart.getId(), prodData.getId());
        if(ordprod.isEmpty()){
            log.debug("The product was not in the cart, so we add it");
            //that product wasn't in the cart, so insert 1 unit of it
            OrderProduct order_product = new OrderProduct();
            order_product.setQuantity(1);
            order_product.setOrder(cart);
            order_product.setProduct(prodData);
            orderProductRepo.save(order_product);
            //return
            return ResponseEntity.ok(order_product);
        }else{
            log.debug("The product was already in the cart, so quantity+=1");
            // there was already some quantity of that product, so just add +1
            OrderProduct order_product=ordprod.get();
            order_product.setQuantity(order_product.getQuantity()+1);
            orderProductRepo.save(order_product);
            //return
            return ResponseEntity.ok(order_product);
        }

    }

    //Remove item from the cart

    /**
     * Removes a product from the cart if the user decided that he's not more interested on this product
     *
     * @param productId The product id to remove from cart
     * @return The order product association that was removed by this call
     * @throws ResourceNotFoundException When user doesn't have a non-completed order, when the product passed is not
     * found or the product is not in the cart
     */
    @DeleteMapping("/removeProductFromCart/{id}")
    public ResponseEntity<OrderProduct> removeProductFromCart(@PathVariable(value = "id") long productId) throws ResourceNotFoundException {
        log.debug("removeProductFromCart");

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get non-complete order info (cart)
        //get the unique not completed order
        OrderDetail cart=orderRepo.notcompletedOrders(customerId).orElseThrow(() -> new ResourceNotFoundException("Non-completed order is not found", ErrorCode.EORD1));


        //get the product corresponding to the id given or return an error.
        Product prodData = productRepo.getInfo(productId).orElseThrow(() -> new ResourceNotFoundException("The product does not exists", ErrorCode.EPRD1));

        //check if the pair (order_id,product_id) is present in the orders_products table.
        OrderProduct ordprod= orderProductRepo.getQuantity(cart.getId(), prodData.getId()).orElseThrow(() -> new ResourceNotFoundException("The product was not in the cart", ErrorCode.EPRD2));

        log.debug("The product was in the cart, so we delete it");
        // The product was in the cart, so we delete it
        orderProductRepo.delete(ordprod);

        // An order without any product associated is useless. So we should delete the order
        List<OrderProduct> prods = orderProductRepo.getByOrderId(cart.getId());
        if (prods.isEmpty()) {
            orderRepo.delete(cart);
        }
        return ResponseEntity.ok(ordprod);

    }


    //Change quantity of a product of the cart (non-completed order)

    /**
     * Edits the quantity of a certain product in the cart.
     *
     * @param productId The product's id where the quantity is going to be modified
     * @param newQuantity The desired new quantity for the product
     * @return The order product association updated with the newest product quantity
     * @throws ResourceNotFoundException When no pending orders are found, when the product does not exist or
     * when the product selected is not in the cart
     * @throws ForbiddenException When the quantity passed is < 1
     */
    @PostMapping("/editProductQuantity")
    public ResponseEntity<OrderProduct> editProductQuantity(
            @RequestParam(value = "productId") long productId,
            @RequestParam(value = "newQuantity") int newQuantity) throws ResourceNotFoundException, ForbiddenException {
        log.debug("editProductQuanity");

        if(newQuantity<1){
            // Should it be badRequest error rather than Forbidden?
            throw new ForbiddenException("You cannot add less than one quantity", ErrorCode.EPRD3);
        }

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get non-complete order info (cart)
        //get the unique not completed order
        OrderDetail cart=orderRepo.notcompletedOrders(customerId).orElseThrow(() -> new ResourceNotFoundException("Non-completed order is not found", ErrorCode.EORD1));

        //get the product corresponding to the id given or return an error.
        Product prodData = productRepo.getInfo(productId).orElseThrow(() -> new ResourceNotFoundException("The product does not exists", ErrorCode.EPRD1));

        //Update, if the product is in the cart
        //check if the pair (order_id,product_id) is present in the orders_products table.
        OrderProduct orderProduct= orderProductRepo.getQuantity(cart.getId(), prodData.getId()).orElseThrow(() -> new ResourceNotFoundException("The product is not in the cart", ErrorCode.EPRD2));

        log.debug("The product was in the cart, so we update the quantity");
        // The product was in the cart, so we update the quantity
        orderProduct.setQuantity(newQuantity);
        orderProductRepo.save(orderProduct);
        //return
        return ResponseEntity.ok(orderProduct);

    }

    //Query list of products of order with order_Id=1234

    /**
     * Returns the products that belongs to an order
     *
     * @param orderId The order interested
     * @return The list of product which belongs to the specified order
     * @throws ResourceNotFoundException When the order is not found, when the customer doesn't own the order passed
     */
    @GetMapping("/getProductsOfOrder")
    public ResponseEntity<List<OrderProduct>> getProductsOfOrder(
            @RequestParam(value = "orderId") long orderId
    ) throws ResourceNotFoundException {
        log.debug("getProductsOfOrder");

        //get customerId
        long customerId=getLoggedCustomer().getId();

        // We can avoid to retrieve the order. However we would like know whether the order exists or not and show a message when the order does not exist
        orderRepo.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order " +orderId+ " not found", ErrorCode.EORD2));

        //check if the Customer owns that order
        orderRepo.checkOrderCustomerMatch(customerId,orderId).orElseThrow(() -> new ResourceNotFoundException("Customer "+customerId+" doesn't own the Order " +orderId, ErrorCode.EORD3));
        List<OrderProduct> orderProduct = orderProductRepo.getByOrderId(orderId);


        return ResponseEntity.ok(orderProduct);
    }

    //Buy all products on the cart

    /**
     * Completes the pending order and add the devices associated with the products in the order
     *
     * @param orderId The order's id that user is buying
     * @param orderAddress The living address of the customer where to send the product
     * @return The list of ordered products
     * @throws ResourceNotFoundException When an address passed is empty, when the cart is not owned by the user or when
     * the cart is empty
     */
    @PostMapping("/buyCart")
    public ResponseEntity<List<OrderProduct>> buyCart(
            @RequestParam(value = "orderId") long orderId,
            @RequestParam(value = "orderAddress") String orderAddress
    ) throws ResourceNotFoundException {

        //Address must not be empty
        if (orderAddress.isBlank()){
            // Should be thrown a specific error for this
            throw new ResourceNotFoundException("Address must not be empty", ErrorCode.EORD4);
        }

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //check if really the order is the cart and is owned by the customer
        OrderDetail order= orderRepo.checkOrderCustomerMatch(customerId,orderId).orElseThrow(() -> new ResourceNotFoundException("Customer "+customerId+" doesn't own the Order " +orderId, ErrorCode.EORD3));
        if (order.isCompleted()){
            throw new ResourceNotFoundException("The selected order is already completed", ErrorCode.EORD5);
        }

        //check if the cart is empty...
        List<OrderProduct> orderProductsCart = orderProductRepo.getByOrderId(orderId);
        if (orderProductsCart.size()<1){
            throw new ResourceNotFoundException("The cart is empty", ErrorCode.EORD6);
        }

        //update from non-completed to completed, update timestamp, update address.
        order.setAddress(orderAddress);
        order.setCompleted(true);
        Date date = new Date();
        order.setTimestamp(date);
        // Store the completed order in database.
        orderRepo.save(order); // Is it necessary this step or is it sufficient to edit the field desired of the entity and the database is updated accordingly?

        //create new empty, non-completed order
        /*OrderDetail newCart=new OrderDetail();
        newCart.setAddress(orderAddress);
        newCart.setCustomer(getLoggedCustomer());
        newCart.setTimestamp(date);
        orderRepo.save(newCart);*/



        Customer customer = getLoggedCustomer();
        //for each product on the completed order, for each quantity: create device
        //TODO: It's better to add all the devices directly in one shot using deviceService. It should be deviceService.addDevices(customer, listofproducts)
        for (OrderProduct op: orderProductsCart) {
            for (int q=0; q<op.getQuantity();q++){
                Product product = op.getProduct();
                log.debug("Buy Cart: trying to add device "+product.getId());
                deviceService.addDevice(customer, product);
                log.debug("Device added");
            }
        }

        return ResponseEntity.ok().build();
    }

}
