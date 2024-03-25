import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import { useProduct } from "./ProductContext";

const steps = ['Login', 'Shipping Address', 'Payment'];

const PurchaseProcessPage = () => {
  const { productInfo } = useProduct();
  console.log(productInfo)
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
    <div>
      <h2>Product Information</h2>
      {productInfo && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
           <div>
          <img style={{height:"200px"}} src={productInfo.productDisplayImage} />
        </div>  
         <div style={{fontFamily:"monospace"}}> 
          <p>Title: {productInfo.productName}</p>
          <p> Price: {productInfo.productPrice}</p></div>
               
</div>
      )}
    </div>
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>All steps completed</Typography>
          </div>
        ) : (
          <div>
            <Typography>{`Step ${activeStep + 1}: ${
              steps[activeStep]
            }`}</Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default PurchaseProcessPage;
