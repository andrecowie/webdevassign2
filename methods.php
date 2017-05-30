<?php
    $db = new mysqli('localhost', 'root', 'onetwo21', 'booking');

    if ($db ->connect_errno > 0) {
        die('Unable to connect to db: ' . $db->connect_error . '.');
    }
    if ($db->query("CREATE TABLE IF NOT EXISTS booking(bknumber int PRIMARY KEY AUTO_INCREMENT, name varchar(20), phone varchar(20), unit int, streetnumber int, street varchar(20), suburb varchar(20),destsuburb varchar(20), time varchar(30),status varchar(10));")) {
    }
    if (isset($_GET['getunassigned'])) {
        $sql = "SELECT * FROM booking WHERE status = 'unassigned'";
        $result = $db->query($sql);
        if ($result->num_rows > 0) {
            $response = array();
            while ($row = $result->fetch_assoc()) {
                $date = explode("-",$row['time']);
                $time =
                array_push($response, array('Ref Number' => $row['bknumber'], 'Name'=>$row['name'], 'Phone #' => $row['phone'], 'Unit #'=>$row['unit'], 'Street #'=>$row['streetnumber'], 'street'=>$row['street'], 'Suburb'=>$row['suburb'], 'Destination Suburb'=>$row['suburb'], 'Time'=>$row['time']));
            }
            echo json_encode($response);
        }
    } elseif (isset($_POST['ref'])) {
        $sql = "SELECT * FROM booking WHERE bknumber = '".$_POST['ref']."'";
        $result = $db->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if ($row['status']=='assigned') {
                    echo "You are trying to assign a taxi to an already assigned job.";
                } else {
                    $sql = "UPDATE booking SET status = 'assigned' WHERE bknumber = '".$_POST['ref']."'";
                    if ($db->query($sql) === true) {
                        echo "Success";
                    }
                }
            }
        } else {
            echo "Error invalid booking reference";
        }
    } else {
        $name=$_GET['name'];
        $phone=$_GET['phone'];
        $unit=$_GET['unit'];
        $streetnum=$_GET['streetnum'];
        $street=$_GET['street'];
        $suburb=$_GET['suburb'];
        $destsuburb=$_GET['destsuburb'];
        $time=$_GET['time'];
        $sql = "INSERT INTO booking(name, phone, unit, streetnumber, street, suburb, destsuburb,time, status) VALUES ('".$name."','".$phone."',".$unit.",".$streetnum.",'".$street."','".$suburb."','".$destsuburb."','".$time."', 'unassigned');";
        if ($result = $db->query($sql)) {
            $timetime = explode("-", $time);
            echo "Your taxi has been booked and your reference number is ".$db->insert_id.". You will be picked up in front of your provided address at ".$timetime[1]." on the ".$timetime[0];
        } else {
            echo "Fail";
        }
    }
    $db->close();
