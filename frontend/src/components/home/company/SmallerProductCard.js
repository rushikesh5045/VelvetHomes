// import React from 'react';
// import { Card, CardContent, Typography } from '@mui/material';

// const SmallerProductCard = ({ product }) => {
//   const cardStyles = {
//     maxWidth: 300, // Adjust the width to your liking
//     margin: '10px', // Adjust the margin to your liking
//     padding:"10px",
//     width:"250px"
//   };

//   const imageStyles = {
//     width: '250px', // Adjust the width to your liking
//     height: '250px', // Adjust the height to your liking
//   };

//   const titleStyles = {
//     fontSize: '10px', // Adjust the font size to your liking
//     height: '1rem', // Set a fixed height for the title
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//   };

//   const priceStyles = {
//     fontSize: '12px', // Adjust the font size to your liking
//   };

//   const cardContentStyles = {
//     padding: '4px', // Adjust the padding to your liking
//   };

//   return (
//     <Card style={cardStyles}>
//       <img src={product.dispimg} alt={product.title} style={imageStyles} />
//       <CardContent style={cardContentStyles}>
//         <Typography variant="body2" component="div" style={titleStyles}>
//           {product.title}
//         </Typography>
//         <Typography variant="body2" color="textSecondary" gutterBottom style={priceStyles}>
//           Rs.{product.price}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default SmallerProductCard;




// SmallerProductCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';

const SmallerProductCard = ({ product, companyId }) => {
 
  const cardStyles = {
    maxWidth: 300, // Adjust the width to your liking
    margin: '10px', // Adjust the margin to your liking
    padding:"10px",
    width:"250px",
    borderRadius:"10px"

  };

  const imageStyles = {
    width: '250px', // Adjust the width to your liking
    height: '250px', // Adjust the height to your liking
  };

 const titleStyles = {
    fontSize: '10px', // Adjust the font size to your liking
    height: '1rem', // Set a fixed height for the title
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const priceStyles = {
    fontSize: '12px', // Adjust the font size to your liking
  };

  const cardContentStyles = {
    padding: '4px', // Adjust the padding to your liking
  };

  return (
    <Card style={cardStyles}>
      <img src={product.dispimg} alt={product.title} style={imageStyles} />
      <CardContent style={cardContentStyles}>
        <Typography variant="body2" component="div" style={titleStyles}>
          {product.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom style={priceStyles}>
          Rs.{product.price}
        </Typography>
        <Link to={`/company-edit/${product.company}/editProduct/${product._id}`}>
          <p style={{backgroundColor:"black",color:"white",padding:"5px",borderRadius:"7px",fontFamily:"monospace",textAlign:"center"}}>Edit Product</p>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SmallerProductCard;
