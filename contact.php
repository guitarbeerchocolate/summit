<?php
$to = 'info@effectivewebdesigns.co.uk';
$subject = "Contact from Website";
$body = 'Sent from '.$_POST['emailaddress'].PHP_EOL;
$body .= 'Message:'.PHP_EOL;
$body .= $_POST['details'].PHP_EOL;
if(mail($to, $subject, $body))
{
	echo 'Email successfully sent';
}
else
{
	echo 'Email delivery failed';
}
?>