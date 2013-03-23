
                        //http://snipplr.com/view/46696/
                        //This jquery extension forces a numeric value
						(function ($) {
							$.fn.forceNumeric = function () {
                                return this.each(function () {
 
                                    $(this).keyup(function() {
                                        if (!/^[0-9]+$/.test($(this).val())) {
                                           $(this).val($(this).val().replace(/[^0-9]/g, ''));
                                        }
                                    });
                                });
                            };
                        })(jQuery);
            
                         function registerEvents(){
                            
                            $('#calculate-payment-button').click( function(){
                                calculatePayment(); 
                            });
							
							$('#principal').forceNumeric();
							$('#interest-rate').forceNumeric();
							$('#term').forceNumeric();
														
						  }
                           
                             var calculatePayment = function(){
                             
                                var principal = ($('#principal').val()).replace(',', '') * 1;
                                var interestRate = $('#interest-rate').val() * 1;
                                var termInMonths = $('#term').val() * 1;
								
								interestRate = interestRate <= 0 ? 0 : interestRate;
								principal <= 0 ? 0 : principal;
								termInMonths <= 0 ? 1 : termInMonths;
								
                                var monthlyInterest = interestRate/(12*100);
                                var monthlyPayment = monthlyInterest <= 0 ? principal / termInMonths : principal * (monthlyInterest/(1-Math.pow(1 + monthlyInterest, -termInMonths)));
                                
                                $('#calculated-payment').html("Your Payment: $" + addCommas(monthlyPayment.toFixed(2)));
                                $('#amortization-schedule').html("");
                            }
                            
                            function addCommas(nStr){
                                nStr += '';
                                x = nStr.split('.');
                                x1 = x[0];
                                x2 = x.length > 1 ? '.' + x[1] : '';
                                var rgx = /(\d+)(\d{3})/;
                                while (rgx.test(x1)) {
                                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                                }
                                return x1 + x2;
                            }
                            
                            //selectedLocation is the jQuery item 
                            //e.g. scrollToLocation($('#mydiv'));
                            var scrollToLocation = function(selectedLocation){
                                                                  
                                    destination = selectedLocation.offset().top;            
                                    $('body, html').animate({scrollTop: destination}, 1000);
                            }
                            
                             $('#get-schedule-button').click( function(){
                               
								handleClick();
                                
                            });
							
							function inputIsValid(){
							    
								var isValid = true;
								var principal = $('#principal').val();
                                var interestRate = $('#interest-rate').val();
                                var termInMonths = $('#term').val();

								$('#principal').css('border-color', 'white');
								$('#interest-rate').css('border-color', 'white');
								$('#term').css('border-color', 'white');
								
                                if(principal <= 0 || !/^[0-9,]+$/.test($('#principal').val())){
								    setFieldInvalid('#principal');
                                    isValid = false;
							    }
								if(interestRate < 0 || !/^[0-9.]+$/.test($('#interest-rate').val())){
                                    setFieldInvalid('#interest-rate');
                                    isValid = false;
								}
								if(termInMonths <= 0 || !/^[0-9]+$/.test($('#term').val())){
                                    setFieldInvalid('#term');
                                    isValid = false;								
								}
								
								return isValid;							
							}
							
							function setFieldInvalid(txtBox){
							    $(txtBox).css('border-color', 'red');
								
							}
							
							function handleClick(){
							    
								if(inputIsValid() === false)
									return;
								
								var schedule = "";
                                var principal = ($('#principal').val()).replace(',', '') * 1;       //multiply times 1 to force to numeric value --- otherwise it will be text
                                var interestRate = $('#interest-rate').val() * 1;
                                var termInMonths = $('#term').val() * 1;
								
								termInMonths = termInMonths <= 0 ? 1 : termInMonths;
                                var originalPrincipal = principal;
                                var monthlyInterest = interestRate <= 0 ? 0 : interestRate/(12*100);
								var monthlyPayment = interestRate <= 0 ? principal / termInMonths :  principal * (monthlyInterest/(1-Math.pow(1 + monthlyInterest, -termInMonths)));
                                
								
								
                                var totalInterest = 0.0;
                                
                                calculatePayment();
                                
                                schedule = "<table><tr><th>Payment</th><th>Principal</th><th class='exclude-on-mobile'>Accumulated Interest</th><th class='exclude-on-mobile'>Principal Payment</th><th class='exclude-on-mobile'>Interest Payment</th></tr>";
                                
                                console.log("Monthly Interest: " + monthlyInterest);
                                console.log("Principal: " + principal);
                                
                                for(i = 1; i < 500; i++)
                                {
                                    var currentInterest = principal * monthlyInterest;
                                    console.log("current interest: " + currentInterest);
                                    
                                    console.log("Pre: Principal: " + principal + " current interest: " + currentInterest + " monthlyPayment: " + monthlyPayment);
                                    principal = ((principal + currentInterest) - monthlyPayment);
                                    console.log("Post: Principal: " + principal + " current interest: " + currentInterest + " monthlyPayment: " + monthlyPayment);
                                    
                                    totalInterest += currentInterest;
                                    
                                    if(principal < 0)
                                        principal = 0;
                                    
                                    schedule = schedule + "<tr>";
                                    schedule = schedule + "    <td>" + i +"</td>";
                                    schedule = schedule + "    <td>$ " + addCommas(principal.toFixed(2)) + "</td>";
                                    schedule = schedule + "    <td class='exclude-on-mobile'>$ " + addCommas(totalInterest.toFixed(2)) + "</td>";
									schedule = schedule + "    <td class='exclude-on-mobile'>$ " + addCommas((monthlyPayment-currentInterest).toFixed(2)) + "</td>";
									schedule = schedule + "    <td class='exclude-on-mobile'>$ " + addCommas(currentInterest.toFixed(2)) + "</td>";
									
									
                                    schedule = schedule + "</tr>";
                                    
                                    if(principal <= 0)
                                        break;
                                }
                                
                                schedule = schedule + "</table>";
                                
                                $('#amortization-schedule').html(schedule);
                                var temp = $('#calculated-payment').html();
                                temp += '<br/>Total Interest: $ ' + addCommas(totalInterest.toFixed(2));
                                temp += '<br/>Total Payoff: $ ' + addCommas((originalPrincipal+totalInterest).toFixed(2));
                                
                                $('#calculated-payment').html(temp);
                                scrollToLocation($('#calculated-payment'));
							}
                            

