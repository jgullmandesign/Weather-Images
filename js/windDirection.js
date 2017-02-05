//  Här kollar vi vilket håll det blåser 
// så att jag kan animera vindriktnings pilen

var degree = 0;
  
  function getWindDirection(direction){
    
    switch(direction){
      case "N":
        degree = 0;
      break;
        
      case "NNE":
        degree = 22,5;
      break;
        
      case "NE":
        degree = 45;
      break;
        
      case "ENE":
        degree = 67,5;
      break;
        
      case "E":
        degree = 90;
      break;
        
      case "ESE":
        degree = 112,5;
      break;
        
      case "SE":
        degree =135;
      break;
        
      case "SSE":
        degree = 157,5;
      break;
        
      case "S":
        degree = 180;
      break;
        
      case "SSW":
        degree = 202,5;
      break;
        
      case "SW":
        degree = 225;
      break;
        
      case "WSW":
        degree = 247,5;
      break;
        
      case "W":
        degree = 270;
      break;
        
      case "WNW":
        degree = 272,5;
      break;
        
      case "NW":
        degree = 315;
      break;
        
      case "NNW":
        degree = 337,5;
      break;
      
      default:
      break;
        
      
    }
    
    windDirection(degree);

  }

//=============================================================
//  Vindriktning
//  Får vindriktningen från filen windDirection.js

function windDirection(degree){
    // Roterar vindriktningspilen..
    $('.wind-direction img').css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
  }

