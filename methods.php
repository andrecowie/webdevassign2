<?php
	$db = new mysqli('localhost', 'root', 'onetwo21', 'booking');

	if ($db ->connect_errno > 0){
		die('Unable to connect to db: ' . $db->connect_error . '.');
	}
	if($db->query("CREATE TABLE IF NOT EXISTS booking(bknumber int PRIMARY KEY AUTO_INCREMENT, name varchar(20), phone varchar(20), unit int, streetnumber int, street varchar(20), suburb varchar(20), time varchar(30),status varchar(10));")){
	}
	$name=$_GET['name'];
	$phone=$_GET['phone'];
	$unit=$_GET['unit'];
	$streetnum=$_GET['streetnum'];
	$street=$_GET['street'];
	$suburb=$_GET['suburb'];
	$time=$_GET['time'];
	$sql = "INSERT INTO booking(name, phone, unit, streetnumber, street, suburb, time, status) VALUES ('".$name."','".$phone."',".$unit.",".$streetnum.",'".$street."','".$suburb."','".$time."', 'unassigned');";
	if($result = $db->query($sql)){
		echo "Your taxi has been booked and your reference number is ".$db->insert_id;
	}else{
		echo "Fail";
	}
 ?>
