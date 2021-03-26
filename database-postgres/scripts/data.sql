/* The statements in this file must be executed in order*/

/* INSERT CUSTOMERS customer*/
INSERT INTO customer
(calls_count, email, password, plan, username)
VALUES
(50, 'email.com', 'password', 'FREE', 'username1'),
(50, 'email2.com', 'password', 'FREE', 'username2'),
(150, 'email3.com', 'password', 'FREE', 'username3');


/******TODO ATTRIBUTE "NAME" ********/
/* INSERT PRODUCT	product */
/*INSERT INTO product
(description,image,price)
VALUES
('Best Temperature sensor on the market','https://cdn.shop.prusa3d.com/515/filament-sensor.jpg',199.99),
('Best Wind sensor on the market','https://images-na.ssl-images-amazon.com/images/I/6187maZE%2B1L._AC_SX425_.jpg',150.50);*/

INSERT INTO product
(description,image,price)
VALUES
('Best Temperature sensor on the market',0,199.99),
('Best Wind sensor on the market',0,150.50);




/* INSERT DATATYPE	data_type */
INSERT INTO data_type
(type_name)
VALUES
('temperature'),
('humidity'),
('pressure'),
('windSpeed'),
('windBearing');


/* INSERT HAS	products_data_types */
INSERT INTO products_data_types
(product_id,data_type_id)
VALUES
(1,1),
(1,2),
(1,3),
(2,4),
(2,5);


/* INSERT ORDER  			order_detail */
INSERT INTO order_detail
(address,completed,timestamp,customer_id)
VALUES
('via rossi 135, MI, Italia',TRUE, CURRENT_TIMESTAMP,1),
('via rossi 135, MI, Italia',FALSE, CURRENT_TIMESTAMP,1);


/***** TO ADD IN THE FOLLOWING RODER **/
/* INSERT CONTAINS		orders_products */
/* INSERT DEVICE			device */
/* INSERT CUSTOMERGROUP	customer_group */
/* INSERT BELONGS			customer_groups_devices */
/* INSERT SENSORDATA		sensor_data */
