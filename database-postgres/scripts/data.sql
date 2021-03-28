/* The statements in this file must be executed in order*/

/* INSERT CUSTOMERS customer - password is 'password' for all customers (bcrypt encrypted) */
INSERT INTO customer
(calls_count, email, password, plan, username)
VALUES
(50, 'email.com', '$2a$10$wEUMgXHcrBNM2.5Pnv7p5OPKW8yCcCBOMOS6UrS18R/uiaHp8JG5S', 'FREE', 'username1'),
(50, 'email2.com', '$2a$10$wEUMgXHcrBNM2.5Pnv7p5OPKW8yCcCBOMOS6UrS18R/uiaHp8JG5S', 'FREE', 'username2'),
(150, 'email3.com', '$2a$10$wEUMgXHcrBNM2.5Pnv7p5OPKW8yCcCBOMOS6UrS18R/uiaHp8JG5S', 'FREE', 'username3');


/******TODO ATTRIBUTE "NAME" ********/
/* INSERT PRODUCT	product */
/*INSERT INTO product
(description,image,price)
VALUES
('Best Temperature sensor on the market','https://cdn.shop.prusa3d.com/515/filament-sensor.jpg',199.99),
('Best Wind sensor on the market','https://images-na.ssl-images-amazon.com/images/I/6187maZE%2B1L._AC_SX425_.jpg',150.50);*/

INSERT INTO product
(name, description,image,price)
VALUES
('temperature sensor', 'Best Temperature sensor on the market',0,199.99),
('wind sensor', 'Best Wind sensor on the market',0,150.50);


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



/* INSERT CUSTOMERGROUP	customer_group */
INSERT INTO customer_group
(customer_id,name)
VALUES
(1,'Group1'),
(1,'Group2'),
(2,'myGroup1'),
(2,'myGroup2'),
(3,'myGroup1-user3');



/* INSERT BELONGS			customer_groups_devices */
INSERT INTO customer_groups_devices
(customer_group_id,device_id)
VALUES
/*customer 1*/
(1,1),
(1,2),
(1,3),
(1,4),
(2,3),
(2,4),
(2,5),
/*customer 2*/
(3,6),
(3,7),
(3,8),
(3,9),
(4,10),
(4,11),
(4,12),
/*customer 3*/
(5,13),
(5,14),
(5,15),
(5,16);


/* INSERT SENSORDATA		sensor_data */
INSERT INTO sensor_data
(device_id,data_type_id,value,timestamp)
VALUES
/*customer 1 - device id=1 - type=1*/
(1,1,20.8,CURRENT_TIMESTAMP),
(1,1,21.8,CURRENT_TIMESTAMP),
(1,1,22.8,CURRENT_TIMESTAMP),
(1,1,23.8,CURRENT_TIMESTAMP),
(1,1,24.8,CURRENT_TIMESTAMP),
/*customer 1 - device id=2 - type=1*/
(2,1,30.8,CURRENT_TIMESTAMP),
(2,1,31.8,CURRENT_TIMESTAMP),
(2,1,32.8,CURRENT_TIMESTAMP),
(2,1,33.8,CURRENT_TIMESTAMP),
(2,1,34.8,CURRENT_TIMESTAMP),
/*customer 1 - device id=3 - type=1*/
(3,1,40.8,CURRENT_TIMESTAMP),
(3,1,41.8,CURRENT_TIMESTAMP),
(3,1,42.8,CURRENT_TIMESTAMP),
(3,1,43.8,CURRENT_TIMESTAMP),
(3,1,44.8,CURRENT_TIMESTAMP),
/*customer 1 - device id=4 - type=2*/
(4,2,50.8,CURRENT_TIMESTAMP),
(4,2,51.8,CURRENT_TIMESTAMP),
(4,2,52.8,CURRENT_TIMESTAMP),
(4,2,53.8,CURRENT_TIMESTAMP),
(4,2,54.8,CURRENT_TIMESTAMP),
/*customer 1 - device id=5 - type=2*/
(5,2,60.8,CURRENT_TIMESTAMP),
(5,2,61.8,CURRENT_TIMESTAMP),
(5,2,62.8,CURRENT_TIMESTAMP),
(5,2,63.8,CURRENT_TIMESTAMP),
(5,2,64.8,CURRENT_TIMESTAMP),

/*customer 2 - device id=6 - type=1*/
(6,1,40.8,CURRENT_TIMESTAMP),
(6,1,41.8,CURRENT_TIMESTAMP),
(6,1,42.8,CURRENT_TIMESTAMP),
(6,1,43.8,CURRENT_TIMESTAMP),
(6,1,44.8,CURRENT_TIMESTAMP),
/*customer 2 - device id=7 - type=1*/
(7,1,40.8,CURRENT_TIMESTAMP),
(7,1,41.8,CURRENT_TIMESTAMP),
(7,1,42.8,CURRENT_TIMESTAMP),
(7,1,43.8,CURRENT_TIMESTAMP),
(7,1,44.8,CURRENT_TIMESTAMP),
/*customer 2 - device id=8 - type=1*/
(8,1,40.8,CURRENT_TIMESTAMP),
(8,1,41.8,CURRENT_TIMESTAMP),
(8,1,42.8,CURRENT_TIMESTAMP),
(8,1,43.8,CURRENT_TIMESTAMP),
(8,1,44.8,CURRENT_TIMESTAMP),
/*customer 2 - device id=9 - type=1*/
(9,1,40.8,CURRENT_TIMESTAMP),
(9,1,41.8,CURRENT_TIMESTAMP),
(9,1,42.8,CURRENT_TIMESTAMP),
(9,1,43.8,CURRENT_TIMESTAMP),
(9,1,44.8,CURRENT_TIMESTAMP),
/*customer 2 - device id=10 - type=2*/
(10,2,60.8,CURRENT_TIMESTAMP),
(10,2,61.8,CURRENT_TIMESTAMP),
(10,2,62.8,CURRENT_TIMESTAMP),
(10,2,63.8,CURRENT_TIMESTAMP),
(10,2,64.8,CURRENT_TIMESTAMP),
/*customer 2 - device id=11 - type=2*/
(11,2,60.8,CURRENT_TIMESTAMP),
(11,2,61.8,CURRENT_TIMESTAMP),
(11,2,62.8,CURRENT_TIMESTAMP),
(11,2,63.8,CURRENT_TIMESTAMP),
(11,2,64.8,CURRENT_TIMESTAMP),
/*customer 2 - device id=12 - type=2*/
(12,2,60.8,CURRENT_TIMESTAMP),
(12,2,61.8,CURRENT_TIMESTAMP),
(12,2,62.8,CURRENT_TIMESTAMP),
(12,2,63.8,CURRENT_TIMESTAMP),
(12,2,64.8,CURRENT_TIMESTAMP),
/*customer 3 - device id=13 - type=1*/
(13,1,40.8,CURRENT_TIMESTAMP),
(13,1,41.8,CURRENT_TIMESTAMP),
(13,1,42.8,CURRENT_TIMESTAMP),
(13,1,43.8,CURRENT_TIMESTAMP),
(13,1,44.8,CURRENT_TIMESTAMP),
/*customer 3 - device id=14 - type=2*/
(14,2,50.8,CURRENT_TIMESTAMP),
(14,2,51.8,CURRENT_TIMESTAMP),
(14,2,52.8,CURRENT_TIMESTAMP),
(14,2,53.8,CURRENT_TIMESTAMP),
(14,2,54.8,CURRENT_TIMESTAMP),
/*customer 3 - device id=15 - type=2*/
(15,2,60.8,CURRENT_TIMESTAMP),
(15,2,61.8,CURRENT_TIMESTAMP),
(15,2,62.8,CURRENT_TIMESTAMP),
(15,2,63.8,CURRENT_TIMESTAMP),
(15,2,64.8,CURRENT_TIMESTAMP),
/*customer 3 - device id=16 - type=2*/
(16,2,160.8,CURRENT_TIMESTAMP),
(16,2,161.8,CURRENT_TIMESTAMP),
(16,2,162.8,CURRENT_TIMESTAMP),
(16,2,163.8,CURRENT_TIMESTAMP),
(16,2,164.8,CURRENT_TIMESTAMP);
