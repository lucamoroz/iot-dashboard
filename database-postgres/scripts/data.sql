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
('via rossi 135, MI, Italia',FALSE, CURRENT_TIMESTAMP,1),
('via verdi 285, TO, USA',TRUE, CURRENT_TIMESTAMP,2),
('via verdi 285, TO, USA',FALSE, CURRENT_TIMESTAMP,2),
('via Bianchi 123, LD, UK',TRUE, CURRENT_TIMESTAMP,3),
('via Bianchi 123, LD, UK',FALSE, CURRENT_TIMESTAMP,3);


/* INSERT CONTAINS		orders_products */
INSERT INTO orders_products
(order_id,product_id,quantity)
VALUES
(1,1,3),	/*custumoer 1 completed order*/
(1,2,2),	/*custumoer 1 completed order*/
(2,1,1),	/*custumoer 1 not-completed order*/
(2,2,3),	/*custumoer 1 not-completed order*/
(3,1,4),	/*custumoer 2 completed order*/
(3,2,3),	/*custumoer 2 completed order*/
(4,1,5),	/*custumoer 2 not-completed order*/
(4,2,1),	/*custumoer 2 not-completed order*/
(5,1,1),	/*custumoer 3 completed order*/
(5,2,3),	/*custumoer 3 completed order*/
(6,1,2),	/*custumoer 3 not-completed order*/
(6,2,2);	/*custumoer 3 not-completed order*/


/* INSERT DEVICE			device */
INSERT INTO device
(product_id,customer_id,version,token,enabled,latitude,longitude,update_frequency,battery,last_update)
VALUES
/*customer 1*/
(1,1,0,'123',TRUE,45.489443,12.177321,50,80,CURRENT_TIMESTAMP),
(1,1,1,'456',TRUE,45.489443,12.177321,100,70,CURRENT_TIMESTAMP),
(1,1,0,'789',FALSE,45.489443,12.177321,500,65,CURRENT_TIMESTAMP),
(2,1,1,'987',TRUE,45.489443,12.177321,10,95,CURRENT_TIMESTAMP),
(2,1,0,'654',TRUE,45.489443,12.177321,300,99,CURRENT_TIMESTAMP),
/*customer 2*/
(1,2,0,'321',TRUE,36.109611, -115.173700,300,95,CURRENT_TIMESTAMP),
(1,2,0,'abc',TRUE,36.109611, -115.173700,50,65,CURRENT_TIMESTAMP),
(1,2,0,'bce',FALSE,36.109611, -115.173700,100,65,CURRENT_TIMESTAMP),
(1,2,0,'ced',FALSE,36.109611, -115.173700,50,95,CURRENT_TIMESTAMP),
(2,2,0,'def',TRUE,36.109611, -115.173700,300,65,CURRENT_TIMESTAMP),
(2,2,0,'efg',FALSE,36.109611, -115.173700,100,95,CURRENT_TIMESTAMP),
(2,2,0,'fgh',FALSE,36.109611, -115.173700,50,80,CURRENT_TIMESTAMP),
/*customer 3*/
(1,3,0,'ghi',TRUE,51.503421, -0.119293,300,95,CURRENT_TIMESTAMP),
(2,3,0,'def',TRUE,51.503421, -0.119293,300,65,CURRENT_TIMESTAMP),
(2,3,0,'def',FALSE,51.503421, -0.119293,300,65,CURRENT_TIMESTAMP),
(2,3,0,'def',FALSE,51.503421, -0.119293,300,65,CURRENT_TIMESTAMP);


/***** TO ADD IN THE FOLLOWING RODER **/
/* INSERT CUSTOMERGROUP	customer_group */
/* INSERT BELONGS			customer_groups_devices */
/* INSERT SENSORDATA		sensor_data */
