const turf = require('@turf/turf');

module.exports = {objDestination};

const Compass = Object.freeze({
    NORTH : 'NORTH',
    EAST : 'EAST',
    WEST : 'WEST',
    SOUTH : 'SOUTH'
});

function objDestination(coodA, coodB){
    if(coodA == coodB){
        return null;
    }
    //const startpoint = coodA;
    //const endpoint = coodB;
    const startpoint = [coodA[1], coodA[0]];
    const endpoint = [coodB[1], coodB[0]];
    const slope = (endpoint[1] - startpoint[1])/(endpoint[0] - startpoint[0]);
    const intercept = startpoint[1] - (startpoint[0] * slope);
    const degrees = turfBearing(startpoint, endpoint);
    const compface = pOfCompass(degrees);
    function compassface(){
        return compface;
    }
    // returns m slope
    function mSlope(){
        return slope;
    }
    // to locate true slope based on the y axis
    // returns m slope y-intercept
    function mIntercept(){
        return intercept;
    }
    // input of x coodinate
    // returns y intercept using the slope equation
    function sIntercept(xPoint){
        return (slope * xPoint[0]) + intercept;
    }
    // input x
    // return y intercept using the reciprocal slope equation to find Y of the inverse point-slope from startpoint.
    function reciInterceptY(point){
        return ((-1/slope) * point) - (((-1/slope) * startpoint[0]) - startpoint[1]);
    }

    // input y
    // return x intercept using the reciprocal slope equation to find X of the inverse point-slope from startpoint
    function reciInterceptX(point){
        return -slope * (point - startpoint[1] + ((-1/slope) * startpoint[0]));
    } 
    // input [x,y]
    // returns perpendicular distance from a point to current object-line
    function xDistance(xPoint){
        let a = slope;
        let b = -1;
        let c = intercept;
        return (Math.abs((a * xPoint[0]) + (b * xPoint[1]) + c))  /  (Math.sqrt( (a * a) + (b * b) ));
    }

    return {compassface, mSlope, mIntercept, sIntercept, reciInterceptY, reciInterceptX, xDistance};

}

//input range from -180 to 180 created by turf function bearing
function pOfCompass(degrees){
    if(degrees > 135 && degrees < 225){
        return Compass.SOUTH;
    }
    else if(degrees > 45 && degrees < 135){
        return Compass.EAST;
    }
    else if(degrees < 315 && degrees > 225){
        return Compass.WEST;
    }else{
        return Compass.NORTH;
    }
}

// Bearing from 2 cood Formula works 
function turfBearing(A,B){
    let degree = turf.bearing(turf.point([A[0], A[1]]),turf.point([B[0], B[1]]));
    console.log((degree + 360) % 360);
    return (degree + 360) % 360;
}

// Bearing from 2 cood Formula works but not accurate
function oldbearing(A,B){
    let Lon = B[1] - A[1];
    let y = Math.sin(Lon) * Math.cos(B[0]);
    let x = Math.cos(A[0]) * Math.sin(B[0]) - Math.sin(A[0]) * Math.cos(B[0]) * Math.cos(Lon);
    let brng = Math.atan2(y,x) * 180 / Math.PI;
    return (360 - ((brng + 360)% 360));
}

let obj = objDestination([1,4],[2,8]);
console.log(obj.mSlope());
console.log(obj.mIntercept());
console.log(obj.xDistance([-2,-4]));
console.log(obj.reciInterceptX(-2));
console.log(obj.reciInterceptY(-2));

turfBearing([0, 0],[0, 1]); // 0
turfBearing([0, 0],[1, 0]); // 90
turfBearing([0, 0],[0, -1]); // 180
turfBearing([0, 0],[-1, 0]); // 270
turfBearing([0, 0],[-1, 1]); // 315
turfBearing([0, 0],[-1, -1]); // 225
turfBearing([-27.988436,153.358690], [-27.9663925, 153.4105253]);
turfBearing([153.358690, -27.988436],[153.4105253, -27.9663925]);
console.log(pOfCompass(turfBearing([153.358690, -27.988436],[153.38296,-27.96552])));

obj = objDestination([-27.9884360,153.3586900],[-27.97409, 153.34202]);
console.log(obj.compassface());

//console.log(turf.pointToLineDistance(turf.point([-2,-4]), turf.lineString([[0,2],[1,5/3]]), {units: 'degrees'}));


