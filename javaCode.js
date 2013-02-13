//Notes: need to div CC and AC SD by 2! Different paper. Done for this but not in excel
//Can check values too
   
//will need to change foot length to schulz...not an error message

/*
if (window.hasOwnProperty('jQuery') === false) {
     // NOTE: It also needs to be version 1.7.2. I have had trouble getting it
     // to work with "newer" versions of jQuery, and I'm not sure why yet ...
        throw new Error('jQuery is missing.');
    }
*/

    
var $ = window.jQuery;

var s3dbURL = "https://uab.s3db.org/s3db/";
var key;

//used to determine values in maceration columns
var step;
var liveBorn = false;

var stringer;
//keep adding text
var textString = "";

var expectedRange=[];
var correctedRange=[];

var trimmedExpected =[];
var trimmedCorrected=[];

var trimmedCorrectedSD=[];
var trimmedExpectedSD=[];

var lowPercentiles = [];
var highpercentiles = [];

var clowPercentiles = [];
var chighPercentiles = [];
//need to know if working on expected or corrected
var iterations = 0;
//used to determine best fit parameter (HC, FL, BW)...which location in table
var useDet;
//what is the actual value of our parameter and compare it to the ranges
var detEntry;
var rangeMeas;

var cleaned = false;
var dataSubmitted = false;
var form1 = document.getElementById("form1");


//2 ages for live vs stillborn
var lvAge;
var GAA;
var detAge;
var currentRange;
var temp = 43;
var tiny = false;

//buttons

var submit = document.getElementById("submit");
var saveResults = document.getElementById("saveResults");
var loginButton = document.getElementById("loginButton");
var submitLogin = document.getElementById("submitLogin");
var logoutButton = document.getElementById("logoutButton");
var exitButton = document.getElementById("exitLogin");
//checkboes

var lvBirth = document.getElementById("livebirth");
var cleanReport = document.getElementById("cleanReport");
//add GA to document
var GA = document.getElementById("GA");
var age = document.getElementById("Age");


var FL = document.getElementById("FL");
var CR = document.getElementById("CR");
var CH = document.getElementById("CH");
var HC = document.getElementById("HC");
var CC = document.getElementById("CC");
var AC = document.getElementById("AC");
var bodyWeight = document.getElementById("bodyWeight");
var BW = document.getElementById("BW");
var LVW = document.getElementById("LVW");
var LUW = document.getElementById("LUW");
var HW = document.getElementById("HW");
var TW = document.getElementById("TW");
var SW = document.getElementById("SW");
var KW = document.getElementById("KW");
var AW = document.getElementById("AW");

var AB = document.getElementById("AB");
var WA = document.getElementById("WA");

//additional save values
var geneticsInfo = document.getElementById("genetics");
var caseNumber = document.getElementById("caseNumber");
var culture = document.getElementById("culture");
var disorder = document.getElementById("disorder");

var removable = document.getElementById("removable");
var hidden = document.getElementById("hiddenBlock");
var hidden2 = document.getElementById("hiddenBlock2");
var removable2 = document.getElementById("removable2");




//select box values below

var mac = document.getElementById("maceration");
var gend = document.getElementById("gender");
var rac = document.getElementById("race");
var gender;
var race;

//
var labels = ["Foot Length (mm)", "Crown Rump Length (cm)", "Crown Heel Length (cm)", "Head Circumference (cm)", "Chest Circumference (cm)", "Abdominal Circumference (cm)", "Body Weight (g)", "Brain Weight (g)", 
"Liver Weight (g)", "Lung Weight (g)", "Heart Weight (g)", "Thymus Weight (g)", "Spleen Weight (g)", "Kidney Weight (g)", "Adrenal Weight (g)"];

var actualRange;

var userName = document.getElementById("userName");
var password = document.getElementById("password");

//will save key
var dataTable = {
    
    //	 0 FL	1CR	2CH	3HC	4CC	5AC	6BW	7bra	8bra	8bra	9liv	10liv	11liv	12lun	13lun	14lu	15ht	16ht	17ht	18thy	19thym	20thym	21sple	22sple	23spl	24kid	24kd	25kd	26ad	27ad	28ad

    M12: [0.9, 7.4, 9.8, 7.1, NaN, NaN, 29.6, 4.8, 4.8, 4.8, 1.5, 1.4, 1.3, 0.6, 0.9, 0.9, 0.1, 0.1, 0.1, 0.03, NaN, NaN, 0.01, NaN, NaN, 0.25, 0.19, 0.19, 0.04, 0.11, 0.11],
    SD12: [0.3, 1.1, 1.7, 1.1, NaN, NaN, 14.9, 1.4, 1.4, 1.4, 1.2, 1.2, 1.2, 0.9, 0.9, 0.9, 0.14, 0.14, 0.14, 0.06, NaN, NaN, 0.02, NaN, NaN, 0.15, 0.15, 0.15, 0.18, 0.18, 0.18],
    M13: [1.2, 8.7, 11.8, 8.5, NaN, NaN, 37.4, 6.5, 6.5, 6.5, 2, 1.7, 1.7, 1.2, 1.2, 1.2, 0.2, 0.2, 0.2, 0.04, NaN, NaN, 0.02, 0.08, 0.08, 0.3, 0.2, 0.2, 0.17, 0.17, 0.17],
    SD13: [0.3, 1.2, 1.8, 1.2, NaN, NaN, 14.9, 1.4, 1.4, 1.4, 1.2, 1.2, 1.2, 0.9, 0.9, 0.9, 0.14, 0.14, 0.14, 0.06, NaN, NaN, 0.03, 0.03, 0.03, 0.1, 0.1, 0.1, 0.18, 0.18, 0.18],
    M14: [1.5, 9.9, 13.7, 9.8, NaN, NaN, 53, 9.1, 9.1, 9.1, 2.9, 2.4, 2.3, 2, 1.5, 1.5, 0.3, 0.3, 0.3, 0.05, 0.07, 0.05, 0.04, 0.14, 0.14, 0.4, 0.3, 0.3, 0.3, 0.2, 0.2],
    SD14: [0.3, 1.2, 1.8, 1.2, NaN, NaN, 14.9, 2.5, 2.5, 2.5, 1.2, 1.2, 1.2, 0.9, 0.9, 0.9, 0.1, 0.1, 0.1, 0.06, 0.06, 0.06, 0.04, 0.04, 0.04, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2],
    M15: [1.8, 11.1, 15.6, 11.1, NaN, NaN, 76.5, 12.7, 12.7, 12.7, 4.2, 3.3, 3.2, 2.9, 2.1, 2.1, 0.5, 0.5, 0.5, 0.07, 0.08, 0.06, 0.06, 0.17, 0.17, 0.6, 0.5, 0.5, 0.5, 0.3, 0.3],
    SD15: [0.3, 1.2, 1.8, 1.2, NaN, NaN, 18.5, 3.9, 3.9, 3.9, 1.2, 1.2, 1.2, 0.9, 0.9, 0.9, 0.1, 0.1, 0.1, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.3, 0.3, 0.3, 0.2, 0.2, 0.2],
    M16: [2.1, 12.4, 17.5, 12.4, NaN, NaN, 108, 17.3, 17.3, 17.3, 5.9, 4.5, 4.2, 3.9, 2.7, 2.7, 0.8, 0.8, 0.8, 0.11, 0.12, 0.09, 0.09, 0.17, 0.17, 0.9, 0.8, 0.8, 0.6, 0.4, 0.4],
    SD16: [0.3, 1.3, 1.8, 1.3, NaN, NaN, 41, 5.4, 5.4, 5.4, 1.5, 1.5, 1.5, 1.2, 1.2, 1.2, 0.2, 0.2, 0.2, 0.06, 0.06, 0.06, 0.08, 0.08, 0.08, 0.4, 0.4, 0.4, 0.3, 0.3, 0.3],
    M17: [2.4, 13.5, 19.3, 13.6, NaN, NaN, 147, 22.9, 22.9, 22.9, 8.1, 6.1, 5.4, 5.1, 3.5, 3.5, 1, 1, 1, 0.18, 0.18, 0.12, 0.13, 0.16, 0.16, 1.3, 1.1, 1.1, 0.8, 0.5, 0.5],
    SD17: [0.3, 1.3, 1.9, 1.3, NaN, NaN, 53, 6.9, 6.9, 6.9, 3, 3, 3, 1.7, 1.7, 1.7, 0.4, 0.4, 0.4, 0.06, 0.06, 0.06, 0.12, 0.12, 0.12, 0.6, 0.6, 0.6, 0.4, 0.4, 0.4],
    M18: [2.7, 14.7, 21.1, 14.8, NaN, NaN, 194, 29.4, 29.4, 29.4, 10.7, 7.9, 6.8, 6.4, 4.4, 4.4, 1.4, 1.4, 1.4, 0.3, 0.3, 0.2, 0.19, 0.15, 0.15, 1.8, 1.5, 1.5, 1, 0.7, 0.7],
    SD18: [0.3, 1.3, 1.9, 1.3, NaN, NaN, 65, 8.4, 8.4, 8.4, 4.5, 4.5, 4.5, 2.3, 2.3, 2.3, 0.5, 0.5, 0.5, 0.2, 0.2, 0.2, 0.17, 0.17, 0.17, 0.8, 0.8, 0.8, 0.4, 0.4, 0.4],
    M19: [3.0, 15.9, 22.9, 16, NaN, NaN, 249, 37, 37, 37, 13.8, 10.1, 8.4, 7.9, 5.4, 5.4, 1.7, 1.7, 1.7, 0.4, 0.4, 0.3, 0.3, 0.15, 0.15, 2.4, 2, 2, 1.2, 0.8, 0.8],
    SD19: [0.3, 1.3, 1.9, 1.3, NaN, NaN, 78, 9.8, 9.8, 9.8, 6, 6, 6, 2.8, 2.8, 2.8, 0.7, 0.7, 0.7, 0.3, 0.3, 0.3, 0.2, 0.22, 0.22, 1, 1, 1, 0.5, 0.5, 0.5],
    M20: [3.3, 17, 24.6, 17.2, 15.1, 12.6, 312, 45.5, 45.5, 45.5, 17.2, 12.5, 10.2, 9.5, 6.5, 6.5, 2.1, 2.1, 2.1, 0.6, 0.5, 0.3, 0.4, 0.17, 0.17, 3, 2.5, 2.5, 1.4, 1, 1],
    SD20: [0.3, 1.4, 1.9, 1.4, 1.25, 1.7, 92, 11.3, 11.3, 11.3, 7.5, 7.5, 7.5, 3.4, 3.4, 3.4, 0.8, 0.8, 0.8, 0.4, 0.4, 0.4, 0.3, 0.29, 0.29, 1.2, 1.2, 1.2, 0.6, 0.6, 0.6],
    M21: [3.6, 18.2, 26.3, 18.3, 15.1, 12.6, 382, 55, 55, 55, 21.1, 15.2, 12.3, 11.2, 7.8, 7.8, 2.6, 2.6, 2.6, 0.8, 0.7, 0.4, 0.5, 0.22, 0.22, 3.8, 3.1, 3.1, 1.7, 1.2, 1.2],
    SD21: [0.3, 1.4, 2, 1.4, 1.25, 1.7, 107, 12.8, 12.8, 12.8, 9, 9, 9, 4, 4, 4, 1, 1, 1, 0.5, 0.5, 0.5, 0.4, 0.36, 0.36, 1.4, 1.4, 1.4, 0.7, 0.7, 0.7],
    M22: [3.9, 19.3, 28, 19.4, 16.7, 14.4, 461, 65.4, 65.4, 65.4, 25.5, 18.2, 14.5, 13.1, 9.2, 9.2, 3.1, 3.1, 3.1, 1, 0.9, 0.6, 0.7, 0.3, 0.3, 4.6, 3.8, 3.8, 1.9, 1.4, 1.4],
    SD22: [0.3, 1.4, 2, 1.4, 0.95, 1.45, 122, 14.3, 14.3, 14.3, 10.4, 10.4, 10.4, 4.6, 4.6, 4.6, 1.1, 1.1, 1.1, 0.6, 0.6, 0.6, 0.4, 0.4, 0.4, 1.6, 1.6, 1.6, 0.8, 0.8, 0.8],
    M23: [4.1, 20.4, 29.6, 20.5, 16.7, 14.4, 547, 76.9, 76.9, 76.9, 30.2, 21.6, 16.9, 15.1, 10.7, 10.7, 3.6, 3.6, 3.6, 1.3, 1.1, 0.7, 0.9, 0.4, 0.4, 5.5, 4.6, 4.6, 2.2, 1.6, 1.6],
    SD23: [0.4, 1.5, 2, 1.4, 0.95, 1.45, 122, 15.8, 15.8, 15.8, 11.9, 11.9, 11.9, 5.3, 5.3, 5.3, 1.3, 1.3, 1.3, 0.8, 0.8, 0.8, 0.5, 0.5, 0.5, 1.9, 1.9, 1.9, 0.8, 0.8, 0.8],
    M24: [4.4, 21.5, 31.2, 21.6, 17.7, 15.6, 641, 89.3, 89.3, 89.3, 35.4, 25.2, 19.5, 17.3, 12.4, 12.4, 4.2, 4.2, 4.2, 1.6, 1.3, 0.8, 1.1, 0.6, 0.6, 6.5, 5.5, 5.5, 2.5, 1.8, 1.8],
    SD24: [0.4, 1.5, 2, 1.5, 1.35, 1.45, 137, 17.2, 17.2, 17.2, 13.4, 13.4, 13.4, 5.9, 5.9, 5.9, 1.4, 1.4, 1.4, 0.9, 0.9, 0.9, 0.6, 0.6, 0.6, 2.1, 2.1, 2.1, 0.9, 0.9, 0.9],
    M25: [4.7, 22.6, 32.8, 22.6, 17.7, 15.6, 743, 103, 103, 103, 41.1, 29.1, 22.3, 19.6, 14.1, 14.1, 4.9, 4.9, 4.9, 1.9, 1.6, 1, 1.4, 0.8, 0.8, 7.6, 6.4, 6.4, 2.8, 2, 2],
    SD25: [0.4, 1.5, 2.1, 1.5, 1.35, 1.45, 154, 19, 19, 19, 14.9, 14.9, 14.9, 6.6, 6.6, 6.6, 1.6, 1.6, 1.6, 1.1, 1.1, 1.1, 0.7, 0.7, 0.7, 2.4, 2.4, 2.4, 1, 1, 1],
    M26: [5.0, 23.6, 34.3, 23.6, 20, NaN, 853, 117, 117, 117, 47.1, 33.4, 25.3, 22, 16, 16, 5.6, 5.6, 5.6, 2.3, 1.9, 1.2, 1.7, 1.1, 1.1, 8.8, 7.4, 7.4, 3.1, 2.3, 2.3],
    SD26: [0.4, 1.5, 2.1, 1.5, 2.2, NaN, 171, 20, 20, 20, 16.4, 16.4, 16.4, 7.3, 7.3, 7.3, 1.7, 1.7, 1.7, 1.2, 1.2, 1.2, 0.9, 0.9, 0.9, 2.7, 2.7, 2.7, 1.1, 1.1, 1.1],
    M27: [5.2, 24.7, 35.8, 24.5, 20, NaN, 971, 133, 133, 133, 53.6, 37.9, 28.6, 24.6, 18, 18, 6.3, 6.3, 6.3, 2.6, 2.2, 1.4, 2.1, 1.4, 1.4, 10.1, 8.4, 8.4, 3.4, 2.5, 2.5],
    SD27: [0.4, 1.6, 2.1, 1.5, 2.2, NaN, 188, 22, 22, 22, 17.9, 17.9, 17.9, 8, 8, 8, 1.8, 1.8, 1.8, 1.4, 1.4, 1.4, 1, 1, 1, 3, 3, 3, 1.2, 1.2, 1.2],
    M28: [5.5, 25.7, 37.3, 25.5, NaN, NaN, 1096, 149, 149, 149, 60.6, 42.7, 32, 27.4, 20.2, 20.2, 7.1, 7.1, 7.1, 3.1, 2.5, 1.6, 2.5, 1.8, 1.8, 11.4, 9.6, 9.6, 3.7, 2.8, 2.8],
    SD28: [0.4, 1.6, 2.2, 1.6, NaN, NaN, 206, 23, 23, 23, 19.3, 19.3, 19.3, 8.7, 8.7, 8.7, 2, 2, 2, 1.6, 1.6, 1.6, 1.1, 1.1, 1.1, 3.3, 3.3, 3.3, 1.3, 1.3, 1.3],
    M29: [5.7, 26.7, 38.7, 26.4, NaN, NaN, 1230, 166, 166, 166, 67.9, 47.8, 35.6, 30.2, 22.5, 22.5, 7.9, 7.9, 7.9, 3.5, 2.9, 1.8, 3, 2.2, 2.2, 12.9, 10.8, 10.8, 4.1, 3.1, 3.1],
    SD29: [0.4, 1.6, 2.2, 1.6, NaN, NaN, 225, 25, 25, 25, 20.8, 20.8, 20.8, 9.5, 9.5, 9.5, 2.1, 2.1, 2.1, 1.8, 1.8, 1.8, 1.3, 1.3, 1.3, 3.6, 3.6, 3.6, 1.4, 1.4, 1.4],
    M30: [6.0, 27.7, 40.1, 27.2, NaN, NaN, 1371, 185, 185, 185, 75.7, 53.3, 39.4, 33.2, 24.9, 24.9, 8.7, 8.7, 8.7, 4, 3.3, 2.1, 3.6, 2.7, 2.7, 14.4, 12.1, 12.1, 4.5, 3.4, 3.4],
    SD30: [0.4, 1.6, 2.2, 1.6, NaN, NaN, 244, 26, 26, 26, 22.3, 22.3, 22.3, 10.2, 10.2, 10.2, 2.3, 2.3, 2.3, 2.1, 2.1, 2.1, 1.4, 1.4, 1.4, 3.9, 3.9, 3.9, 1.4, 1.4, 1.4],
    M31: [6.2, 28.7, 41.4, 28.1, NaN, NaN, 1520, 204, 204, 204, 83.9, 59, 43.4, 36.3, 27.4, 27.4, 9.6, 9.6, 9.6, 4.5, 3.7, 2.3, 4.2, 3.3, 3.3, 16, 13.4, 13.4, 4.8, 3.8, 3.8],
    SD31: [0.4, 1.7, 2.2, 1.7, NaN, NaN, 264, 28, 28, 28, 23.8, 23.8, 23.8, 11, 11, 11, 2.4, 2.4, 2.4, 2.3, 2.3, 2.3, 1.6, 1.6, 1.6, 4.3, 4.3, 4.3, 1.5, 1.5, 1.5],
    M32: [6.4, 29.7, 42.8, 28.9, 26.7, NaN, 1677, 224, 224, 224, 92.6, 65, 47.6, 39.6, 30, 30, 10.6, 10.6, 10.6, 5, 4.2, 2.6, 4.8, 3.9, 3.9, 17.7, 14.9, 14.9, 5.2, 4.1, 4.1],
    SD32: [0.4, 1.7, 2.3, 1.7, 0.55, NaN, 285, 29, 29, 29, 25.3, 25.3, 25.3, 11.8, 11.8, 11.8, 2.6, 2.6, 2.6, 2.5, 2.5, 2.5, 1.8, 1.8, 1.8, 4.6, 4.6, 4.6, 1.6, 1.6, 1.6],
    M33: [6.7, 30.6, 44, 29.7, 26.7, NaN, 1842, 245, 245, 245, 102, 71.3, 52.1, 43, 32.8, 32.8, 11.6, 11.6, 11.6, 5.6, 4.6, 2.9, 5.5, 4.5, 4.5, 19.5, 16.4, 16.4, 5.6, 4.5, 4.5],
    SD33: [0.4, 1.7, 2.3, 1.7, 0.55, NaN, 306, 31, 31, 31, 27, 26.7, 26.7, 12.6, 12.6, 12.6, 2.7, 2.7, 2.7, 2.8, 2.8, 2.8, 1.9, 1.9, 1.9, 5, 5, 5, 1.7, 1.7, 1.7],
    M34: [6.9, 31.6, 45.3, 30.5, 28.7, NaN, 2015, 268, 268, 268, 111, 77.9, 56.7, 46.6, 35.7, 35.7, 12.6, 12.6, 12.6, 6.2, 5.1, 3.2, 6.3, 5.2, 5.2, 21.4, 18, 18, 6, 4.8, 4.8],
    SD34: [0.4, 1.8, 2.3, 1.7, 1.5, NaN, 328, 32, 32, 32, 28, 28.2, 28.2, 13.5, 13.5, 13.5, 2.9, 2.9, 2.9, 3.1, 3.1, 3.1, 2.1, 2.1, 2.1, 5.4, 5.4, 5.4, 1.8, 1.8, 1.8],
    M35: [7.1, 32.5, 46.5, 31.2, 28.7, NaN, 2195, 291, 291, 291, 121, 84.8, 61.5, 50.3, 38.7, 38.7, 13.7, 13.7, 13.7, 6.9, 5.7, 3.5, 7.2, 6, 6, 23.3, 19.6, 19.6, 6.5, 5.2, 5.2],
    SD35: [0.5, 1.8, 2.3, 1.8, 1.5, NaN, 350, 33, 33, 33, 30, 29.7, 29.7, 14.3, 14.3, 14.3, 3, 3, 3, 3.3, 3.3, 3.3, 2.3, 2.3, 2.3, 5.8, 5.8, 5.8, 1.9, 1.9, 1.9],
    M36: [7.3, 33.4, 47.7, 31.9, 30.7, NaN, 2383, 315, 315, 315, 132, 92.1, 66.5, 54.1, 41.9, 41.9, 14.8, 14.8, 14.8, 7.5, 6.2, 3.8, 8.1, 6.7, 6.7, 25.4, 21.4, 21.4, 6.9, 5.6, 5.6],
    SD36: [0.5, 1.8, 2.4, 1.8, 1.35, NaN, 373, 35, 35, 35, 31, 31.2, 31.2, 15.2, 15.2, 15.2, 3.2, 3.2, 3.2, 3.6, 3.6, 3.6, 2.5, 2.5, 2.5, 6.2, 6.2, 6.2, 2, 2, 2],
    M37: [7.6, 34.3, 48.9, 32.6, 30.7, NaN, 2580, 340, 340, 340, 142, 100, 71.7, 58.1, 45.1, 45.1, 16, 16, 16, 8.2, 6.8, 4.2, 9.1, 7.5, 7.5, 27.5, 23.2, 23.2, 7.4, 6, 6],
    SD37: [0.5, 1.8, 2.4, 1.8, 1.35, NaN, 397, 36, 36, 36, 33, 33, 32.7, 16.1, 16.1, 16.1, 3.3, 3.3, 3.3, 3.9, 3.9, 3.9, 2.7, 2.7, 2.7, 6.6, 6.6, 6.6, 2.1, 2.1, 2.1],
    M38: [7.8, 35.2, 50, 33.2, 32.1, NaN, 2784, 366, 366, 366, 154, 107, 77.2, 62.2, 48.5, 48.5, 17.2, 17.2, 17.2, 8.9, 7.4, 3.9, 10.1, 8.3, 8.3, 29.8, 25, 25, 7.8, 6.5, 6.5],
    SD38: [0.5, 1.9, 2.4, 1.8, 1.3, NaN, 421, 38, 38, 38, 34, 34, 34.2, 17, 17, 17, 3.4, 3.4, 3.4, 4.2, 4.2, 4.2, 3, 3, 3, 7.1, 7.1, 7.1, 2.2, 2.2, 2.2],
    M39: [8.0, 36.1, 51.1, 33.8, 32.1, NaN, 2996, 394, 394, 394, 165, 116, 82.8, 66.5, 52.1, 52.1, 18.5, 18.5, 18.5, 9.7, 8, 5, 11.2, 9.1, 9.1, 32.1, 27, 27, 8.3, 6.9, 6.9],
    SD39: [0.5, 1.9, 2.4, 1.9, 1.3, NaN, 446, 39, 39, 39, 36, 36, 35.6, 18, 18, 18, 3.6, 3.6, 3.6, 4.6, 4.6, 4.6, 3.2, 3.2, 3.2, 7.5, 7.5, 7.5, 2.3, 2.3, 2.3],
    M40: [8.2, 37, 52.1, 34.4, 33, 30.9, 3215, 422, 422, 422, 177, 124, 88.6, 70.9, 55.7, 55.7, 19.8, 19.8, 19.8, 10.5, 8.6, 5.4, 12.4, 9.9, 9.9, 34.5, 29, 29, 8.8, 7.4, 7.4],
    SD40: [0.5, 1.9, 2.5, 1.9, 1.3, 7.5, 471, 41, 41, 41, 37, 37, 37.1, 18.9, 18.9, 18.9, 3.7, 3.7, 3.7, 4.9, 4.9, 4.9, 3.4, 3.4, 3.4, 8, 8, 8, 2.4, 2.4, 2.4],
    M41: [8.4, 37.8, 53.1, 35, 33, 30.9, 3443, 451, 451, 451, 190, 133, 94.6, 75.4, 59.5, 59.5, 21.2, 21.2, 21.2, 11.3, 9.3, 5.8, 13.7, 10.7, 10.7, 37, 31.1, 31.1, 9.3, 7.9, 7.9],
    SD41: [0.5, 1.9, 2.5, 1.9, 1.3, 7.5, 497, 42, 42, 42, 39, 39, 38.6, 19.9, 19.9, 19.9, 3.9, 3.9, 3.9, 5.3, 5.3, 5.3, 3.7, 3.7, 3.7, 8.4, 8.4, 8.4, 2.5, 2.5, 2.5],
    M42: [8.6, 38.6, 54.1, 35.5, 33.4, NaN, 3678, 481, 481, 481, 203, 142, 101, 80.1, 63.4, 63.4, 22.5, 22.5, 22.5, 12.2, 10, 6.2, 15, 11.5, 11.5, 39.6, 33.3, 33.3, 9.9, 8.4, 8.4],
    SD42: [0.5, 2, 2.5, 2, 1.4, NaN, 524, 44, 44, 44, 40, 40, 40, 20.9, 20.9, 20.9, 4, 4, 4, 5.6, 5.6, 5.6, 4, 4, 4, 8.9, 8.9, 8.9, 2.6, 2.6, 2.6],
    M43: [8.8, 39.4, 55, 36, 33.4, NaN, 3922, 512, 512, 512, 216, 151, 107, 84.9, 67.4, 67.4, 24, 24, 24, 13.1, 10.7, 6.6, 16.4, 12.2, 12.2, 42.2, 35.5, 35.5, 10.4, 8.9, 8.9],
    SD43: [0.5, 2, 2.5, 2, 1.4, NaN, 551, 45, 45, 45, 42, 42, 42, 21.9, 21.9, 21.9, 4.2, 4.2, 4.2, 6, 6, 6, 4.2, 4.2, 4.2, 9.4, 9.4, 9.4, 2.7, 2.7, 2.7]

};



var preemieHC = {
    //	  3RD	50TH  97TH	
    M22: [16.8, 19.5, 22],
    M23: [18, 21, 23.5],
    M24: [19, 22, 25],
    M25: [20.2, 23, 26],
    M26: [21, 24.3, 27.1],
    M27: [22, 25.3, 28.2],
    M28: [23, 26, 29.2],
    M29: [24, 27.2, 30],
    M30: [25, 28, 31],
    M31: [25.8, 29, 32],
    M32: [26.5, 29.8, 33],
    M33: [27, 30.5, 33.8],
    M34: [28, 31.4, 34.6],
    M35: [28.5, 32, 35.3],
    M36: [29.2, 32.8, 36],
    M37: [30, 33.4, 36.7],
    M38: [30.7, 34, 37.3],
    M39: [31.2, 34.8, 38],
    M40: [32, 35.4, 38.5],
    M41: [32.5, 36, 39],
    M42: [33, 36.5, 39.6],
    M43: [33.5, 37, 40],
    M44: [34, 37.6, 40.6],
    M45: [34.7, 38, 41],
    M46: [35, 38.5, 41.5],
    M47: [35.4, 38.9, 42],
    M48: [36, 39.2, 42.2],
    M49: [36.3, 39.7, 42.5],
    M50: [36.7, 39.9, 42.7]

};

var preemieLength = {
    //	  3rd	50th  97th	
    M22: [24.6, 28.9, 33.7],
    M23: [26, 30.3, 35],
    M24: [27.5, 32, 36.8],
    M25: [29, 33.5, 38.2],
    M26: [30.2, 35, 39.8],
    M27: [31.8, 36.3, 41],
    M28: [33, 38, 42.5],
    M29: [34.2, 39, 43.9],
    M30: [35.8, 40.5, 45],
    M31: [37, 41.8, 46],
    M32: [38, 43, 47.3],
    M33: [39.2, 44, 48.2],
    M34: [40.4, 45.1, 49.5],
    M35: [41.7, 46, 50.5],
    M36: [42.8, 47, 51.5],
    M37: [43.9, 48, 52.5],
    M38: [45, 49, 53.2],
    M39: [45.8, 50, 54.3],
    M40: [46.8, 51, 55.2],
    M41: [47.7, 52, 56],
    M42: [48.6, 52.6, 57],
    M43: [49.3, 53.2, 57.8],
    M44: [50, 54.1, 58.5],
    M45: [51, 55, 59.4],
    M46: [51.6, 55.8, 60],
    M47: [52, 56.3, 60.8],
    M48: [52.8, 57, 61.5],
    M49: [53.3, 57.6, 62.1],
    M50: [54, 58.1, 63]


};

var preemieWT = {
    //	3rd	  50th	97th	Fenton
    M22: [310, 500, 620],
    M23: [400, 580, 800],
    M24: [450, 690, 920],
    M25: [500, 800, 1100],
    M26: [550, 900, 1270],
    M27: [600, 1000, 1400],
    M28: [680, 1150, 1630],
    M29: [740, 1300, 1870],
    M30: [850, 1500, 2100],
    M31: [1000, 1650, 2350],
    M32: [1130, 1850, 2600],
    M33: [1300, 2050, 2880],
    M34: [1500, 2300, 3140],
    M35: [1700, 2500, 3400],
    M36: [1980, 2800, 3690],
    M37: [2150, 3000, 3900],
    M38: [2300, 3200, 4100],
    M39: [2500, 3400, 4380],
    M40: [2610, 3600, 4590],
    M41: [2800, 3750, 4800],
    M42: [2950, 3950, 5000],
    M43: [3100, 4100, 5200],
    M44: [3230, 4300, 5400],
    M45: [3380, 4500, 5600],
    M46: [3500, 4650, 5800],
    M47: [3620, 4800, 6000],
    M48: [3750, 4980, 6200],
    M49: [3900, 5130, 6400],
    M50: [4080, 5300, 6600]


};

var liveBirthM = {
    //schulz  ROLLS TO 1 MO...
    //  Brain	liver	lungs		Heart		Thymus		Spleen		Kidneys		Adrenal

    M1: [460, 140, 64, 23, 7.8, 12, 34, 5.1],
    SD1: [47, 40, 21, 7, 5.3, 4, 9, 1.7],
    M2: [506, 160, 74, 27, 9.4, 15, 39, 5],
    SD2: [67, 46, 20, 7, 4.4, 5, 9, 1.6],
    M3: [567, 179, 89, 30, 10, 16, 45, 5],
    SD3: [81, 41, 23, 7, 5, 5, 10, 1.8],
    M4: [620, 195, 96, 31, 10, 17, 47, 4.9],
    SD4: [71, 41, 27, 7, 6, 5, 12, 2],
    M5: [746, 228, 93, 35, 12, 18, 54, 5.3],
    SD5: [91, 47, 18, 5, 7, 7, 11, 1.9],
    M6: [762, 259, 115, 40, 10, 20, 62, 5.2],
    SD6: [73, 58, 31, 8, 6, 7, 14, 2],
    M7: [767, 276, 118, 43, 12, 23, 69, 5.5],
    SD7: [32, 54, 33, 8, 9, 10, 14, 2.1],
    M8: [774, 285, 104, 44, 10, 20, 66, 5.4],
    SD8: [95, 57, 32, 8, 6, 7, 14, 2.3],
    M9: [820, 288, 109, 45, 10, 22, 67, 5.4],
    SD9: [49, 47, 33, 7, 4, 5, 16, 2],
    M10: [850, 300, 110, 46, 9, 24, 72, 5.7],
    SD10: [96, 69, 34, 6, 5, 11, 17, 2.1],
    M11: [875, 305, 130, 48, 19, 28, 76, 6.1],
    SD11: [89, 81, 31, 7, 4, 10, 19, 1.8],
    M12: [954, 325, 116, 50, 12, 28, 76, 6.3],
    SD12: [35, 39, 23, 6, 5, 7, 13, 2.2]

};

var liveBirthF = {

    M1: [433, 139, 64, 21, 6.6, 11, 31, 4.8],
    SD1: [59, 31, 27, 5, 4.9, 4, 8, 1.9],
    M2: [490, 159, 74, 26, 5.8, 14, 36, 4.7],
    SD2: [51, 31, 23, 6, 4.7, 5, 10, 1.4],
    M3: [525, 183, 81, 28, 9.7, 15, 42, 4.8],
    SD3: [89, 39, 14, 4, 6.9, 5, 12, 1.4],
    M4: [595, 204, 91, 30, 9, 17, 50, 4.6],
    SD4: [80, 49, 24, 6, 7.3, 5, 11, 2.1],
    M5: [725, 227, 102, 36, 13, 19, 52, 4.8],
    SD5: [62, 38, 22, 5, 5, 5, 13, 2.2],
    M6: [730, 242, 111, 37, 10, 18, 58, 4.6],
    SD6: [85, 58, 30, 7, 6, 8, 20, 1.5],
    M7: [750, 272, 111, 40, 10, 22, 65, 5.5],
    SD7: [92, 51, 38, 9, 8, 8, 14, 2.2],
    M8: [770, 276, 109, 41, 8, 20, 60, 5.3],
    SD8: [96, 54, 35, 7, 5, 9, 13, 2.3],
    M9: [810, 288, 105, 41, 9, 18, 62, 5.4],
    SD9: [82, 67, 28, 5, 5, 6, 10, 1.5],
    M10: [830, 284, 105, 43, 12, 25, 66, 5.7],
    SD10: [117, 48, 21, 7, 7, 11, 10, 1.7],
    M11: [875, 292, 125, 44, 15, 23, 68, 6.2],
    SD11: [64, 36, 31, 8, 8, 9, 14, 2],
    M12: [886, 315, 115, 49, 11, 27, 72, 6],
    SD12: [64, 38, 34, 6, 8, 9, 19, 1.4]



};

var CDCMHC = {

    //		5th		50th		95th	
    M0: [32.15, 35.81, 38.52],
    M1: [35.05, 38.20, 40.70],
    M2: [37.12, 39.93, 42.30],
    M3: [38.63, 41.21, 43.50],
    M4: [39.79, 42.21, 44.45],
    M5: [40.73, 43.03, 45.23],
    M6: [41.50, 43.72, 45.89],
    M7: [42.14, 44.31, 46.46],
    M8: [42.70, 44.82, 46.96],
    M9: [43.17, 45.27, 47.41],
    M10: [43.59, 45.67, 47.81],
    M11: [43.95, 46.02, 48.17],
    M12: [44.28, 46.35, 48.49]


};

var CDCFHC = {
    //		5th		50th		95th	
    M0: [32.25, 34.71, 37.65],
    M1: [34.73, 37.01, 39.70],
    M2: [36.52, 38.68, 41.20],
    M3: [37.84, 39.92, 42.34],
    M4: [38.86, 40.91, 43.24],
    M5: [39.69, 41.72, 43.99],
    M6: [40.39, 42.40, 44.63],
    M7: [40.98, 42.98, 45.19],
    M8: [41.49, 43.49, 45.68],
    M9: [41.93, 43.94, 46.11],
    M10: [42.32, 44.35, 46.50],
    M11: [42.67, 44.71, 46.86],
    M12: [42.98, 45.04, 47.19]



};


var CDCML = {

    //   		5th		50th		95th	
    M0: [45.57, 49.99, 54.31],
    M1: [50.64, 54.66, 58.98],
    M2: [54.25, 58.12, 62.49],
    M3: [57.01, 60.84, 65.28],
    M4: [59.29, 63.15, 67.66],
    M5: [61.26, 65.17, 69.76],
    M6: [63.01, 66.99, 71.66],
    M7: [64.60, 68.66, 73.40],
    M8: [66.05, 70.20, 75.02],
    M9: [67.41, 71.65, 76.54],
    M10: [68.67, 73.01, 77.97],
    M11: [69.86, 74.29, 79.32],
    M12: [70.98, 75.52, 80.62]


};

var CDCFL = {

    //		5th		50th		95th	
    M0: [45.58, 49.29, 53.77],
    M1: [49.72, 53.48, 57.68],
    M2: [52.83, 56.69, 60.77],
    M3: [55.31, 59.28, 63.34],
    M4: [57.42, 61.50, 65.59],
    M5: [59.28, 63.47, 67.61],
    M6: [60.97, 65.26, 69.47],
    M7: [62.52, 66.91, 71.19],
    M8: [63.95, 68.45, 72.80],
    M9: [65.30, 69.89, 74.33],
    M10: [66.57, 71.26, 75.78],
    M11: [67.78, 72.55, 77.16],
    M12: [68.93, 73.79, 78.49]


};

var CDCMWT = {
    //   		5th		50th		95th	
    M0: [2527, 3530, 4340],
    M1: [3370, 4441, 5439],
    M2: [4139, 5276, 6444],
    M3: [4830, 6032, 7351],
    M4: [5451, 6717, 8169],
    M5: [6008, 7336, 8906],
    M6: [6509, 7897, 9571],
    M7: [6959, 8404, 10169],
    M8: [7364, 8863, 10710],
    M9: [7728, 9279, 11197],
    M10: [8057, 9656, 11638],
    M11: [8354, 9998, 12038],
    M12: [8623, 10310, 12401]



};

var CDCFWT = {
    //		5th		50th		95th	
    M0: [2548, 3399, 4153],
    M1: [3221, 4171, 5074],
    M2: [3849, 4888, 5926],
    M3: [4429, 5545, 6705],
    M4: [4964, 6149, 7417],
    M5: [5457, 6703, 8069],
    M6: [5912, 7211, 8666],
    M7: [6332, 7679, 9214],
    M8: [6719, 8108, 9717],
    M9: [7076, 8504, 10181],
    M10: [7406, 8868, 10609],
    M11: [7711, 9205, 11005],
    M12: [7992, 9516, 11374]


};


var liveMale = {
    //      CC    AC
    M0: [35.1, 34],
    M1: [36.3, 35.1],
    M2: [39.6, 38.6],
    M3: [41.7, 40.6],
    M4: [42.9, 41.9],
    M5: [43.7, 42.7],
    M6: [44.5, 43.4],
    M7: [45, 43.9],
    M8: [45.5, 44.5],
    M9: [45.7, 44.7],
    M10: [46.2, 45],
    M11: [46.5, 45.2],
    M12: [47, 45.5]


};

var liveFemale = {
    //       CC    AC
    M0: [34.5, 33.5],
    M1: [35.8, 34.5],
    M2: [38.9, 38.1],
    M3: [40.6, 39.9],
    M4: [41.9, 41.1],
    M5: [42.7, 41.9],
    M6: [43.2, 42.7],
    M7: [43.7, 43.2],
    M8: [44.2, 43.7],
    M9: [44.7, 43.9],
    M10: [45.2, 44.2],
    M11: [45.5, 44.4],
    M12: [46, 44.7]


};

$(document).ready(function () {
    //help boxes
    //localStorage.setItem("user", user);
    if (localStorage.getItem("key") != null) {
        //var key = localStorage.getItem("key");
        //s3dbc.setKey(key);
        //added 1/31
          //  $('#removeLogin').fadeOut('fast');
          //  $('#hiddenLogin').fadeOut('fast');
          //  $('#loggedInCurrently').fadeTo('fast', 1);

    }

    $("#menu").accordion({ collapsible: true, active: false });
});

lvBirth.onclick = function () {
    if (hidden.style.display == "none") {
        removable.style.display = 'none';
        removable2.style.display = 'none'

        hidden.style.display = 'block';
        hidden2.style.display = 'block';
        liveBorn = true;

        
    }
    else {
        removable.style.display = 'block';
        hidden.style.display = 'none';
        removable2.style.display = 'block';
        hidden2.style.display = 'none';
        liveBorn = false;

    }
};

cleanReport.onclick = function () {
    if (cleaned == true) {
        cleaned = false;
    }
    else { cleaned = true; }
}
submitLogin.onclick = function () {
    loginUser();
    return false;
};
submit.onclick = function(){resetUse ()};

//{resetUse ()};
saveResults.onclick = function () { testmyDB() };
loginButton.onclick = function () { loadLoginForm() };

logoutButton.onclick = function () { logoutProc();  }
exitButton .onclick = function(){
    $('#removeLogin').fadeTo('fast', 1);
     //document.getElementById('loginArea').style.top = '2%';
     $('#hiddenLogin').fadeout('fast');

}
//resetUse()

//var y=document.getElementById("maceration").options;

//use det takes input to use and will need to have index in table. After found, go to output function


var useGA = function (valGA) {

    //first convert input in terms of table ... add an M and search

    //ex: GA 35 so use M35 values, if out of range because larger, then use ++ and add M

    //debating on global for current mean or limit scope; make sure body weight entry too


    //if (parseInt(bodyWeight.value) > 0 || parseInt(FL.value) > 0) {
    //change to global gaM and gaSD
    var gaM = "M" + valGA;
    var gaSD = "SD" + valGA;

    

    // store my initial guess at GA

    //for (var i = 0; i < actualRange.length ; i++) { alert(actualRange[i]) };
    //for (var i = 0; i < 4; i++) { alert(actualRange[i]) };
    //alert(GA.value)

    //will have correction in later function
    if (tiny == false) {
        expectedRange = [dataTable["M" + GA.value], dataTable["SD" + GA.value]];
    }
    //need a way to determine schulz vs Maroun
    if (liveBorn == false || detAge == "Foot Length" || tiny == true) {

        rangeMeas = calcTwoSD(gaM, gaSD, useDet, 0);
    }
    else {
        switch (detAge) {
            case "Body Length":
                rangeMeas = [preemieLength[gaM][0], preemieLength[gaM][2]];
                break;
            case "Body Weight":
                rangeMeas = [preemieWT[gaM][0], preemieWT[gaM][2]];
                break;
            case "Head Circumference":
                rangeMeas = [preemieHC[gaM][0], preemieHC[gaM][2]];
                break;
        }

    };
    if (detAge != "None") {
        detInRange(rangeMeas, gaM, gaSD);
    }



    //}

}

var useLive = function (valAge, time) {
    //liveBirth table
    var jumper = 0;
    if (time == 0) {

        expectedRange = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        for (k = 7; k <= 14; k++) {
            if (gender == "male") {

                expectedRange[0][k + jumper] = liveBirthM["M" + age.value][k - 7];
                expectedRange[1][k + jumper] = liveBirthM["SD" + age.value][k - 7];

            }
            else {
                expectedRange[0][k + jumper] = liveBirthF["M" + age.value][k - 7];
                expectedRange[1][k + jumper] = liveBirthF["SD" + age.value][k - 7];
            };
            jumper += 2;
        };
    };


    var ageM = "M" + valAge;
    var ageSD = "SD" + valAge;
    if (GAA != 99) {




        if (gender == "male") {
            switch (detAge) {
                case "Body Length":
                    rangeMeas = [CDCML[ageM][0], CDCML["M" + lvAge][2]];
                    break;
                case "Body Weight":
                    rangeMeas = [CDCMWT[ageM][0], CDCMWT["M" + lvAge][2]];
                    break;
                case "Head Circumference":
                //alert (lvAge + " " + CDCMHC["M" + lvAge][2])
                    rangeMeas = [CDCMHC["M" + lvAge][0], CDCMHC["M" + lvAge][2]];
                    break;
            };
        }
        else {
            switch (detAge) {
                case "Body Length":
                    rangeMeas = [CDCFL["M" + lvAge][0], CDCFL["M" + lvAge][2]];
                    break;
                case "Body Weight":
                    rangeMeas = [CDCFWT["M" + lvAge][0], CDCFWT["M" + lvAge][2]];
                    break;
                case "Head Circumference":
                    rangeMeas = [CDCFHC["M" + lvAge][0], CDCFHC["M" + lvAge][2]];
                    break;
            };

        }
    }
    else {
       
        if (temp <= 48) {
            
            switch (detAge) {
                case "Body Length":
                    rangeMeas = [preemieLength["M" + temp][0], preemieLength["M" + temp][2]];
                    break;
                case "Body Weight":
                    rangeMeas = [preemieWT["M" + temp][0], preemieWT["M" + temp][2]];
                    break;
                case "Head Circumference":
                    rangeMeas = [preemieHC["M" + temp][0], preemieHC["M" + temp][2]];
                    break;
            };
        }
        else {
            if (gender == "male") {
                
                switch (detAge) {
                    case "Body Length":
                        rangeMeas = [CDCML[ageM][0], CDCML["M" + lvAge][2]];
                        break;
                    case "Body Weight":
                        rangeMeas = [CDCMWT[ageM][0], CDCMWT["M" + lvAge][2]];
                        break;
                    case "Head Circumference":
                   
                        rangeMeas = [CDCMHC["M" + lvAge][0], CDCMHC["M" + lvAge][2]];
                        break;
                };
            }
            else {
                switch (detAge) {
                    case "Body Length":
                        rangeMeas = [CDCFL["M" + lvAge][0], CDCFL["M" + lvAge][2]];
                        break;
                    case "Body Weight":
                        rangeMeas = [CDCFWT["M" + lvAge][0], CDCFWT["M" + lvAge][2]];
                        break;
                    case "Head Circumference":
                        rangeMeas = [CDCFHC["M" + lvAge][0], CDCFHC["M" + lvAge][2]];
                        break;
                };
            }
        };
    };

    if (detAge != "None") {
       
        detInRange(rangeMeas, ageM, ageSD);
    }
}

var calcTwoSD = function (myMean, mySD, index, tableID) {
    //broadened to include schulz...if checked then
   
    var mini;
    var maxi
    switch (tableID) {
        case 0:
            mini = dataTable[myMean][index] - dataTable[mySD][index] * 2;
            maxi = dataTable[myMean][index] + dataTable[mySD][index] * 2;
            break;

        case 1:
            mini = liveBirth[myMean][index] - liveBirth[mySD][index] * 2;
            maxi = liveBirth[myMean][index] + liveBirth[mySD][index] * 2;
            break;


    }
    return [mini, maxi];
    /*
    if (liveBorn == false || GAA <= 43) {
    }
    else {
    }
    
    */
}


var detInRange = function (rangeMeas, myMean, mySD) {
    //I WILL catch stuff >43....

    //choose either FL or body weight with an additional variable...
    //will add each time to GA until found, call useGA each time.

    //anonymous function? vs passing parameters
    //attempted to keep within 12 - 43

    //use this part for stillborn and include other measurements...its just an extension of comparison

    //get a failsafe for footlength >43

    //AB.value < 37
    if (liveBorn == false || AB.value <= 43 && GAA < 99) {

        if (detEntry > rangeMeas[1] && GAA < 43) {

            GAA++;

            useGA(GAA);
        }
        else if (detEntry < rangeMeas[0] && GAA > 12) {
           
            GAA--;
            useGA(GAA);
        }
        else {
            //may not need iterations statement or variable...
            if (liveBorn == true && detAge == "Foot Length" && detEntry > rangeMeas[1]) {

                alert("You need to choose a different search parameter, foot length values only available to 43 weeks.")
                stop();
            }
            else if (liveBorn == true && detEntry > rangeMeas[1]) {
                alert("Schulz live birth values will be used in best fit")
                lvAge = 1;
                temp++;
                //so it goes to next section
                GAA = 99;
                useLive(lvAge, 1);
            }

            else if (liveBorn == false && detEntry > rangeMeas[1] && GAA >= 43) {

                alert("The values you entered appear compatible with birth values, was this a live birth? If so, click the box in the top left corner.")

                stop();
            }


            //had else corrected Range here
            else {

                correctedRange = [dataTable[myMean], dataTable[mySD]];
            }
            //need to make between 12 and 43

            //generate_report();
        };

    }

    else if (GAA >= 99) {

        //for LIVE infants
        var jumper = 0;
        //stop();
        //can probably avoid using below...

        //will have to alter...4 weeks of preemies equals a month

        if (detEntry > rangeMeas[1]) {
            //will need to create the dreaded temp variable... to be deleted in later programming
            if (GAA == 99 && temp < 48) {
                temp++;
                useLive(lvAge, 1);
            }
            else {

                temp = 999;
                lvAge++;
                useLive(lvAge, 1);
            }
        }
        else if (detEntry < rangeMeas[0]) {
            if (lvAge > 1) {
                lvAge--;
                useLive(lvAge, 1);
                //GAA--;
                //useGA(GAA);
            }
            else {
                //will need to roll to useGA
                tiny = true;
                GA.value = 43;
                GAA = 43;
                useGA(GAA, 0);
                alert("This infant has a size smaller than most live borns");
                //stop();
            }
        }


        else {

            /*
            for (i = 0; i <= 14; i++) {
            correctedRange[0][i] = NaN;
            correctedRange[1][i] = NaN;
            };
            */

            correctedRange = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

            for (k = 7; k <= 14; k++) {
                if (gender == "male") {
                    //start at 7

                    correctedRange[0][k + jumper] = liveBirthM[myMean][k - 7];
                    correctedRange[1][k + jumper] = liveBirthM[mySD][k - 7];
                }
                else {
                    correctedRange[0][k + jumper] = liveBirthF[myMean][k - 7];
                    correctedRange[1][k + jumper] = liveBirthF[mySD][k - 7];
                };
                jumper += 2;
            };
            //need to make between 12 and 43
            // correctedRange = [liveBirth[myMean], liveBirth[mySD]];
            //generate_report();
        }

    };



    //iterations = iterations + 1;

}



var resetUse = function () {
    CH.style.background = 'white';
    FL.style.background = 'white';
    bodyWeight.style.background = 'white';
    HC.style.background = 'white';

    textString = "";
    $('#report-output').text("");
    //iterations = 0;
    actualRange = [FL.value, CR.value, CH.value, HC.value, CC.value, AC.value, bodyWeight.value, BW.value, LVW.value, LUW.value, HW.value, TW.value, SW.value, KW.value, AW.value];

    gender = gend.options[gend.selectedIndex].value;
    race = rac.options[rac.selectedIndex].value;
    //var maceration = mac.options[mac.selectedIndex].value;

    checkValues();

    if (liveBorn == false) {
        var detA = document.getElementById('detAge');
        detAge = detA.options[detA.selectedIndex].value;
        defineAgeParams(detAge);
        //if ((FL.value != "" && detAge === "Foot Length") || (bodyWeight.value != "" && detAge === "Body Weight")) {

        if ((HC.value != "" && detAge === "Head Circumference") || (bodyWeight.value != "" && detAge === "Body Weight") || (CH.value != "" && detAge === "Body Length") ||
        (FL.value != "" && detAge === "Foot Length") || detAge === "None") {
            GAA = GA.value;

            //stop evil negatives!!



            useGA(GAA);
        }

        else {
            alert("You need to insert a value for " + detAge)
            if (detAge === "Body Length") {
                CH.style.background = "yellow";
            }
            else if (detAge === "Body Weight") {
                bodyWeight.style.background = "yellow";
            }
            else if (detAge === "Foot Length") {
                FL.style.background = "yellow";
            }
            else {
                HC.style.background = "yellow";
            };

        };
    }
    //live borns below
    else {

        //need a statement to check OR stuff
        if (age.value <= 0 || (AB.value != "" && age.value != "") || (WA.value != "" && age.value != "")) { stop(); }
        var detA2 = document.getElementById('detAge2');
        detAge = detA2.options[detA2.selectedIndex].value;

        defineAgeParams(detAge);


        if ((HC.value != "" && detAge === "Head Circumference") || (bodyWeight.value != "" && detAge === "Body Weight") || (CH.value != "" && detAge === "Body Length") ||
        (FL.value != "" && detAge === "Foot Length") || detAge == "None") {
            //for use with live birth
            //need error catch for entering both months and age

            //maceration will be fixed at none
            //will need male/female entry
            //add foot length for when less than 43

            if (WA.value != "" && AB.value != "") {

                GA.value = parseInt(WA.value) + parseInt(AB.value);
                //removed AB.value < 37
                if (GA.value <= 43) {

                    GAA = GA.value;
                    useGA(GAA);

                    //this function will do the corrections for body weight, length, HC
                    // (function () {
                    //problem is its percentiles not SD!!!

                    //merges new tables!!

                    if (GAA < 99) {
                        pullPercentiles(0, GA.value, GAA);
                    }
                    else {
                        pullPercentiles(0, GA.value, lvAge);
                    }
                    //need to roll over to larger values if greater than 43 new value
                    /*
                    if (GA.value != GAA && GAA <=43) {
                    pullPercentiles(0, GA.value, GAA);
                    }
                    //  });
                    */
                    //post correction after report

                }
                else {

                    //if > 43... convert to months
                    switch (true) {
                        case (GA.value >= 44) && (GA.value <= 47):
                            age.value = 1;
                            break;
                        case (GA.value >= 48) && (GA.value <= 51):
                            age.value = 2;
                            break;
                        case (GA.value >= 52) && (GA.value <= 55):
                            age.value = 3;
                            break;
                        case (GA.value >= 56) && (GA.value <= 59):
                            age.value = 4;
                            break;
                        case (GA.value >= 60) && (GA.value <= 63):
                            age.value = 5;
                            break;
                        case (GA.value >= 64) && (GA.value <= 67):
                            age.value = 6;
                            break;
                        case (GA.value >= 68) && (GA.value <= 71):
                            age.value = 7;
                            break;
                        case (GA.value >= 72) && (GA.value <= 75):
                            age.value = 8;
                            break;
                        case (GA.value >= 76) && (GA.value <= 79):
                            age.value = 9;
                            break;
                        case (GA.value >= 80) && (GA.value <= 83):
                            age.value = 10;
                            break;
                        case (GA.value >= 84) && (GA.value <= 87):
                            age.value = 11;
                            break;
                        case (GA.value >= 88) && (GA.value <= 91):
                            age.value = 12;
                            break;
                        default:
                            alert("Outside of available ranges, can not generate norms greater than 91 weeks (12 months)")
                            break;
                    }
                    alert("The corrected gestational age fits better in the Schulz table and this number will be converted to: " + age.value + " months.")
                    //GAA == 100;

                    //GA.value = "";
                    AB.value = "";
                    WA.value = "";
                    //lvAge = age.value;
                    resetUse();
                    //useLive(lvAge, 0);
                    //alert (lvAge + " " + age.value)
                    //pullPercentiles(1, age.value, lvAge);
                };

            }

            //this uses months
            else {
                if (detAge == "Foot Length") {
                    alert("Please choose a different search parameter, foot length is used for stillborn and premature infant searches")
                    stop();
                }
                GAA = 100;
                lvAge = age.value;

                useLive(lvAge, 0);
                if (tiny == false) {
                    pullPercentiles(1, age.value, lvAge);
                }
                else {
                    pullPercentiles(1, age.value, age.value);
                }

            };
            //can use a correction for <43wks and substitute the values


        }
        //write a reset background function
        else {
            alert("You need to insert a value for " + detAge)
            if (detAge === "Body Length") {
                CH.style.background = "yellow";
            }
            else if (detAge === "Body Weight") {
                bodyWeight.style.background = "yellow";
            }
            else if (detAge === "Foot Length") {
                FL.style.background = "yellow";
            }
            else {
                HC.style.background = "yellow";
            };

        }

    }
    generate_report();
    document.getElementById('report-output').style.display = 'block';
}

var stop = function () {
    //This is used when > 43 weeks
    //if (liveBorn == false) {
      //  alert("The values you entered appear compatible with birth values, was this a live birth? If so, click the box in the top left corner.")
   // }
};


var defineAgeParams = function (detAge) {

    switch (detAge) {
        case "Foot Length":
            useDet = 0;
            detEntry = parseFloat(FL.value);

            break;

        case "Body Weight":
            if (liveBorn == false) {
                useDet = 6;
                detEntry = parseFloat(bodyWeight.value);
            }
            else {
                useDet = 0;
                detEntry = parseFloat(bodyWeight.value);
            }
            break;

        case "Head Circumference":
            useDet = 3;
            detEntry = parseFloat(HC.value);
            break;

        case "Body Length":
       
            useDet = 2;
            detEntry = parseFloat(CH.value);
            break;
        case "None":
            useDet = 999;
            detEntry = 999;
            break;
        default:
            alert("error");
            break;
    }

    /*
    if (detAge === "Foot Length") {

    useDet = 0;
    detEntry = FL.value;

    }
    else {
    useDet = 6;
    detEntry = parseInt(bodyWeight.value);
    }
    */

};


 $(document.body).keyup(function (evt) {
       
 // This function adds hotkeys so that the user doesn't have to scroll
         // all the way to the top and click the button in order to inspect a
         // freshly generated report. I will add support for touch gestures in
         // the near future when I can obtain a tablet to test with.
            if ((evt.which === 13) && ($('textarea:visible').length === 0)) {
             // The user pressed "Enter".
                //evt.preventDefault();
                //$('#generate-report').click();
            } 
		else if (evt.which === 27) {
             // The user pressed "Escape".
		
        
        document.getElementById('report-output').style.display = 'none';
        
                //it reaches here but doesn't close display!!!
               
            }
            return
 });





 var checkValues = function () {
     if (liveBorn == false && (GA.value > 43 || GA.value < 12)) {
         alert("Enter a value between 12 and 43 weeks")
         GA.style.background = "yellow";
         stop();
     }
     else if (liveBorn == true) {
         if ((age.value > 12 || age.value <= 0) && AB.value == "") {
             alert("Range only goes to 12 months, cannot process this value. If you entered 0, please enter values in weeks using above entries.")
             age.style.background = "yellow";
             stop();
         }
         if (AB.value > 43) {
             alert("Please convert to months (adding in time alive).  This needs to be less than 12 months")
             AB.style.background = "yellow";
             stop();
         }

     }

     for (var i = 0; i < labels.length; i++) {

         if (actualRange[i] < 0) {
             alert("A negative value or text has been entered and is not valid")
             //actualRange[i] = 0;
             
             stop();
         }
         //if (actualRange[i] === undefined  || actualRange[i] <= 0) {
         //actualRange[i] = "No Entry";
         //}

     }
 }

 generate_report = function () {
     // This function joins the output from each section's own generating
     // function as text and puts that text into the designated textarea.
     // I will define a generic sentence and append each line with unit and (expected range = x)

     //if ($('#report-output:visible').length === 0) {
     // If the textarea is hidden, we don't need to generate the report.
     //   return;
     //}
     generate_expected();
     if (detAge != "None" && (GAA != GA.value && age.value != lvAge)) {
         // alert (age.value +" " + lvAge)
         generate_corrected();
         document.getElementById('report-output').style.height = "fit-content";
     };
     if (tiny == true) {
         // alert (age.value +" " + lvAge)
        
         generate_corrected();
         document.getElementById('report-output').style.height = "400px";
     }
     //Need option to hide empty values
     if (tiny == true) {
         $('#report-output').text("The expected measurements for:" + " " + age.value + " " + "months" + "\r\n" + textString);
     }
     else if (GAA <= 99) {
         $('#report-output').text("The expected measurements for:" + " " + GA.value + " " + "weeks" + "\r\n" + textString);
     }
     else if (GAA > 99) {
         $('#report-output').text("The expected measurements for:" + " " + age.value + " " + "months" + "\r\n" + textString);
     }

     //will use ex: body weight = 4000 (expected range for GA is 3000 - 3500 grams)
     //drawTable();
     drawVisualization();
 };


 var generate_expected = function () {


     trimmedExpected = trimmer(expectedRange[0]);

     trimmedExpectedSD = trimmer(expectedRange[1]);

     for (var i = 0; i < labels.length; i++) {
         //store new range for actual values and text	
         //trimmedExpected, trimmedCorrected
         if (cleaned == false || (cleaned == true && actualRange[i] != "")) {

             //$('#report-output').(expectedRange[0][i]);
             // \n for new paragraph and append
             //currentRange = calcTwoSD("M" + GA.value, "SD" + GA.value, i);
             if (liveBorn == false) {
                 textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + " with 95% range of" + " " + Math.round([trimmedExpected[i] - trimmedExpectedSD[i] * 2] * 10) / 10 + " - " + Math.round([trimmedExpected[i] + trimmedExpectedSD[i] * 2] * 10) / 10 + ")";
             }
             else {
                 if (labels[i] == "Crown Heel Length (cm)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + " with 5th and 95th percentiles of  " + lowPercentiles[0] + " to " + highpercentiles[0] + ")";
                 }
                 else if (labels[i] == "Head Circumference (cm)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + " with 5th and 95th percentiles of  " + lowPercentiles[1] + " to " + highpercentiles[1] + ")";

                 }

                 else if (labels[i] == "Body Weight (g)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + " with 5th and 95th percentiles of  " + lowPercentiles[2] + " to " + highpercentiles[2] + ")";

                 }
                 else if (labels[i] == "Chest Circumference (cm)" || labels[i] == "Abdominal Circumference (cm)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + "--Ranges not available at this time)";

                 }
                 else {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + " with 95% range of" + " " + Math.round([trimmedExpected[i] - trimmedExpectedSD[i] * 2] * 10) / 10 + " - " + Math.round([trimmedExpected[i] + trimmedExpectedSD[i] * 2] * 10) / 10 + ")";
                 }
             };
         }
     }

 }

 var generate_corrected = function () {


     trimmedCorrected = trimmer(correctedRange[0]);

     trimmedCorrectedSD = trimmer(correctedRange[1]);
     if (tiny == true){
         textString = textString + "\r\n" + "\r\n" + "Most compatible measurements for :" + " " + GAA + " " + "weeks" + "\r\n"
     }
     else if (GAA < 99) {
         textString = textString + "\r\n" + "\r\n" + "Most compatible measurements for :" + " " + GAA + " " + "weeks" + "\r\n"
     }
     if (GAA >= 99) {
         textString = textString + "\r\n" + "\r\n" + "Most compatible measurements for :" + " " + lvAge + " " + "months" + "\r\n"
     }
     for (var i = 0; i < labels.length; i++) {
         //store new range for actual values and text	
         //trimmedExpected, trimmedCorrected

         //$('#report-output').(expectedRange[0][i]);
         // \n for new paragraph and append
         //currentRange = calcTwoSD("M" + GA.value, "SD" + GA.value, i);
         if (cleaned == false || (cleaned == true && actualRange[i] != "")) {

             if (liveBorn == false || tiny == true) {
                 textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedCorrected[i] + " with 95% range of" + " " + Math.round([trimmedCorrected[i] - trimmedCorrectedSD[i] * 2] * 10) / 10 + " - " + Math.round([trimmedCorrected[i] + trimmedCorrectedSD[i] * 2] * 10) / 10 + ")";
             }
             else {
                 if (labels[i] == "Crown Heel Length (cm)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedCorrected[i] + " with 5th and 95th percentiles of  " + clowPercentiles[0] + " to " + chighPercentiles[0] + ")";
                 }
                 else if (labels[i] == "Head Circumference (cm)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedCorrected[i] + " with 5th and 95th percentiles of  " + clowPercentiles[1] + " to " + chighPercentiles[1] + ")";

                 }

                 else if (labels[i] == "Body Weight (g)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedCorrected[i] + " with 5th and 95th percentiles of  " + clowPercentiles[2] + " to " + chighPercentiles[2] + ")";

                 }
                 else if (labels[i] == "Chest Circumference (cm)" || labels[i] == "Abdominal Circumference (cm)") {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedExpected[i] + "--Ranges not available at this time)";

                 }
                 else {
                     textString = textString + "\r\n" + labels[i] + " " + actualRange[i] + " " + "(Mean:" + " " + trimmedCorrected[i] + " with 95% range of" + " " + Math.round([trimmedCorrected[i] - trimmedCorrectedSD[i] * 2] * 10) / 10 + " - " + Math.round([trimmedCorrected[i] + trimmedCorrectedSD[i] * 2] * 10) / 10 + ")";
                 }
             };
         }

     }

 }
 var trimmer = function (longArray) {
     var maceration = mac.options[mac.selectedIndex].value;

     if (liveBorn == true) {
         maceration = "None to mild";
     }

     var count = 0;
     var trimmedReturn = [];
     var step = 1;
     for (var i = 0; i < longArray.length; i += step) {
         
         //after >=7
         if (i < 7) {
             trimmedReturn[count] = longArray[i];

         }
         else if (i == 7) {
             step = 3

             if (maceration === "None to mild") {
                 trimmedReturn[count] = longArray[i];

             }
             else if (maceration == "Moderate") {
                 i = i + 1;

                 trimmedReturn[count] = longArray[i];
             }
             else {
                 i = i + 2;
                 trimmedReturn[count] = longArray[i];
             }
         }
         else {


             trimmedReturn[count] = longArray[i];

         }

         //if (trimmedReturn[i] == 0) {
           //  trimmedReturn[i] = NaN;
         //}
         count++;
     }
     return trimmedReturn;

 }






function drawVisualization() {
  // Create and populate the data table.
 //need to add if no corrected is available

   var cssClassNames = {
    'headerRow': 'bold-darkblue-font large-font bold-font',
    'tableColumn': 'small-width',
    'tableRow': 'left-text',
    'oddTableRow': 'beige-background',
    'selectedTableRow': 'orange-background large-font',
    'hoverTableRow': '',
    'headerCell': 'gold-border',
    'tableCell': 'left-text',
    'rowNumberCell': 'underline-blue-font'};

     var options = {'showRowNumber': false, 'allowHtml': true, 'cssClassNames': cssClassNames, 'width':'70%'}


var stopNumber = 0;
var data = new google.visualization.DataTable();
data.addColumn('string','Measurements')
var myLabels = []
if (tiny == true){
    myLabels = ['Actual values', 'Expected Means' + " " + age.value + " months", 'SD', 'Min', 'Max', 'Most Compatible Means' + " " + GAA + " weeks", 'SD', 'Min', 'Max'];
}

else if (GAA < 99){
   
myLabels = ['Actual values', 'Expected Means' + " " + GA.value + " weeks", 'SD', 'Min', 'Max', 'Most Compatible Means' + " " + GAA + " weeks", 'SD', 'Min', 'Max'];
}
else if (GAA == 99){
    myLabels = ['Actual values', 'Expected Means' + " " + GA.value + " weeks", 'SD', 'Min', 'Max', 'Most Compatible Means' + " " + lvAge + " months", 'SD', 'Min', 'Max'];
    }
else {
    myLabels = ['Actual values', 'Expected Means' + " " + age.value + " months", 'SD', 'Min', 'Max', 'Most Compatible Means' + " " + lvAge + " months", 'SD', 'Min', 'Max'];
}


//additionalData[j] = checkNaN(additionalData[j], myLabels, stopNumber);

if (GAA == GA.value || age.value == lvAge || detAge == "None") {
  
   
    stopNumber = 4;
}
if (tiny == true) { stopNumber = 0; }
for (var i = 0; i < myLabels.length - stopNumber; i++) {
    data.addColumn('string', myLabels[i]);
    //this was number, now text
    //data.setCell(0, i, true, {'style': 'background-color: red;'});
};

  

var additionalData = convertTable();
//var newData = []
for (var j = 0; j < labels.length; j++) {

    additionalData[j] = checkNaN(additionalData[j], myLabels, stopNumber)
    data.addRow(additionalData[j]);
    
       // alert (additionalData[j][1] + " " + typeof additionalData [j][1])
        //additionalData[j]);
        
        // data.setCell(i, 1, {'className': 'bold-font'});
        //data.setRowProperties(j, {'style' : 'italic-purple-font large-font'} );
        if (labels[j] != "Head Circumference (cm)" && labels[i] != "Body Weight (g)" && labels[i] != "Crown Heel Length (cm)") {

            if (actualRange[j] > trimmedExpected[j] + 2 * trimmedExpectedSD[j] || actualRange[j] < trimmedExpected[j] - 2 * trimmedExpectedSD[j]) {

                data.setCell(j, 1, (actualRange[j]), null, { 'className': 'yellow-border left-text' });
            }
            if (GA != GAA && actualRange[j] > trimmedCorrected[j] + 2 * trimmedCorrectedSD[j] || actualRange[j] < trimmedCorrected[j] - 2 * trimmedCorrectedSD[j]) {

                data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font left-text' });
            }


            if ((GA != GAA && actualRange[j] > trimmedCorrected[j] + 2 * trimmedCorrectedSD[j] || actualRange[j] < trimmedCorrected[j] - 2 * trimmedCorrectedSD[j]) &&
    (actualRange[j] > trimmedExpected[j] + 2 * trimmedExpectedSD[j] || actualRange[j] < trimmedExpected[j] - 2 * trimmedExpectedSD[j])) {

                data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font yellow-border left-text' });
            }
        }
        else {

            switch (labels[j]) {
                case "Head Circumference (cm)":
                    if (actualRange[j] < lowPercentiles[1] || actualRange[j] > highpercentiles[1]) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'yellow-border left-text' });
                    }
                    if (actualRange[j] < clowPercentiles[1] || actualRange[j] > chighPercentiles[1]) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font left-text' });
                    }

                    if ((actualRange[j] < clowPercentiles[1] || actualRange[j] > chighPercentiles[1]) && (actualRange[j] < lowPercentiles[1] || actualRange[j] > highpercentiles[1])) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font yellow-border left-text' });
                    }
                    break;

                case "Crown Heel Length (cm)":
                    if (actualRange[j] < lowPercentiles[0] || actualRange[j] > highpercentiles[0]) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'yellow-border left-text' });
                    }
                    if (actualRange[j] < clowPercentiles[0] || actualRange[j] > chighPercentiles[0]) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font left-text' });
                    }

                    if ((actualRange[j] < clowPercentiles[0] || actualRange[j] > chighPercentiles[0]) && (actualRange[j] < lowPercentiles[0] || actualRange[j] > highpercentiles[0])) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font yellow-border left-text' });
                    }
                    break;

                case "Body Weight (g)":
                    if (actualRange[j] < lowPercentiles[2] || actualRange[j] > highpercentiles[2]) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'yellow-border left-text' });
                    }
                    if (actualRange[j] < clowPercentiles[2] || actualRange[j] > chighPercentiles[2]) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font left-text' });
                    }

                    if ((actualRange[j] < clowPercentiles[2] || actualRange[j] > chighPercentiles[2]) && (actualRange[j] < lowPercentiles[2] || actualRange[j] > highpercentiles[2])) {
                        data.setCell(j, 1, (actualRange[j]), null, { 'className': 'italic-red-font yellow-border left-text' });
                    }
                    break;
            }


        //setRowProperty(rowIndex, name, value)
    }
    //area for checking NaN
   
   // checkNaN(actualRange[j], myLabels);

}




  // Create and draw the visualization.
  visualization = new google.visualization.Table(document.getElementById('table'));
  visualization.draw(data, options);

  saveResults.style.display = 'inline-block';

}

function convertTable(){
    var convertedTable = [];
    var j = 0;
        if (tiny == true){
            for (var i = 0; i < labels.length; i++) {
                    
                        
                       
                    
                    switch (labels[i]) {
                        case "Head Circumference (cm)":
                            
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[1], highpercentiles[1], parseFloat(trimmedCorrected[i]),
        parseFloat(trimmedCorrectedSD [i]), Math.round([parseFloat(trimmedCorrected[i]) - trimmedCorrectedSD[i] * 2] * 10) / 10, Math.round([parseFloat(trimmedCorrected[i]) + 2 * trimmedCorrectedSD[i]] * 10) / 10]
                            
                            break;

                        case "Crown Heel Length (cm)":
                            
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[0], highpercentiles[0], parseFloat(trimmedCorrected[i]),
        parseFloat(trimmedCorrectedSD [i]), Math.round([parseFloat(trimmedCorrected[i]) - trimmedCorrectedSD[i] * 2] * 10) / 10, Math.round([parseFloat(trimmedCorrected[i]) + 2 * trimmedCorrectedSD[i]] * 10) / 10]
                            
                            break;

                        case "Body Weight (g)":
                           
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[2], highpercentiles[2],parseFloat(trimmedCorrected[i]),
        parseFloat(trimmedCorrectedSD [i]), Math.round([parseFloat(trimmedCorrected[i]) - trimmedCorrectedSD[i] * 2] * 10) / 10, Math.round([parseFloat(trimmedCorrected[i]) + 2 * trimmedCorrectedSD[i]] * 10) / 10]
                            
                            break;

                        default:
                          convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), trimmedExpectedSD[i], Math.round([parseFloat(trimmedExpected[i]) - 2 * trimmedExpectedSD[i]] * 10) / 10, Math.round([parseFloat(trimmedExpected[i]) + 2 * trimmedExpectedSD[i]] * 10) / 10, parseFloat(trimmedCorrected[i]),
        parseFloat(trimmedCorrectedSD[i]), Math.round([parseFloat(trimmedCorrected[i]) - trimmedCorrectedSD[i] * 2] * 10) / 10, Math.round([parseFloat(trimmedCorrected[i]) + 2 * trimmedCorrectedSD[i]] * 10) / 10];
                            break;
                    }

                }

        }

        else if (liveBorn == false) {
            if (GAA == GA.value) {
                for (var i = 0; i < labels.length; i++) {
                    
                        
                        convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), trimmedExpectedSD[i], Math.round([parseFloat(trimmedExpected[i]) - 2 * trimmedExpectedSD[i]] * 10) / 10, Math.round([parseFloat(trimmedExpected[i]) + 2 * trimmedExpectedSD[i]] * 10) / 10]
                    

                }

            }
            else {

                for (var i = 0; i < labels.length; i++) {
                  
                    convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), trimmedExpectedSD[i], Math.round([parseFloat(trimmedExpected[i]) - 2 * trimmedExpectedSD[i]] * 10) / 10, Math.round([parseFloat(trimmedExpected[i]) + 2 * trimmedExpectedSD[i]] * 10) / 10, parseFloat(trimmedCorrected[i]),
        parseFloat(trimmedCorrectedSD[i]), Math.round([parseFloat(trimmedCorrected[i]) - trimmedCorrectedSD[i] * 2] * 10) / 10, Math.round([parseFloat(trimmedCorrected[i]) + 2 * trimmedCorrectedSD[i]] * 10) / 10];
                
                }

            }
        }
        else {

            for (var i = 0; i < labels.length; i++) {

                if (labels[i] != "Head Circumference (cm)" && labels[i] != "Body Weight (g)" && labels[i] != "Crown Heel Length (cm)") {
                    if (age.value == lvAge && GAA != 99 || (GA.value == GAA && AB.value != "") || detAge == "None") {

                        convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), trimmedExpectedSD[i], Math.round([parseFloat(trimmedExpected[i]) - 2 * trimmedExpectedSD[i]] * 10) / 10, Math.round([parseFloat(trimmedExpected[i]) + 2 * trimmedExpectedSD[i]] * 10) / 10]


                    }

                    else {

                        convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), trimmedExpectedSD[i], Math.round([parseFloat(trimmedExpected[i]) - 2 * trimmedExpectedSD[i]] * 10) / 10, Math.round([parseFloat(trimmedExpected[i]) + 2 * trimmedExpectedSD[i]] * 10) / 10, parseFloat(trimmedCorrected[i]),
        parseFloat(trimmedCorrectedSD[i]), Math.round([parseFloat(trimmedCorrected[i]) - trimmedCorrectedSD[i] * 2] * 10) / 10, Math.round([parseFloat(trimmedCorrected[i]) + 2 * trimmedCorrectedSD[i]] * 10) / 10];
                    }

                }
                else {

                    switch (labels[i]) {
                        case "Head Circumference (cm)":
                            if ((age.value == lvAge && GAA != 99) || (GA.value == GAA && AB.value != "") || detAge == "None") {

                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[1], highpercentiles[1]]
                            }
                            else {
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[1], highpercentiles[1], parseFloat(trimmedCorrected[i]),
        NaN, clowPercentiles[1], chighPercentiles[1]]
                            }
                            break;

                        case "Crown Heel Length (cm)":
                            if (age.value == lvAge && GAA != 99 || (GA.value == GAA && AB.value != "" || detAge == "None")) {
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[0], highpercentiles[0]]
                            }
                            else {
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[0], highpercentiles[0], parseFloat(trimmedCorrected[i]),
        NaN, clowPercentiles[0], chighPercentiles[0]]
                            }
                            break;

                        case "Body Weight (g)":
                            if (age.value == lvAge && GAA != 99 || (GA.value == GAA && AB.value != "") || detAge == "None") {
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[2], highpercentiles[2]]
                            }
                            else {
                                convertedTable[i] = [labels[i], parseFloat(actualRange[i]), parseFloat(trimmedExpected[i]), NaN, lowPercentiles[2], highpercentiles[2], parseFloat(trimmedCorrected[i]),
        NaN, clowPercentiles[2], chighPercentiles[2]]
                            }
                            break;
                    }


                }
            }

        };
    //var newTable = checkNaN(convertedTable, myLabels, stopNumber)
    return convertedTable; 
    //convertedTable;
}

//for pain in the rear tables that lack SDs.
function pullPercentiles(tableID, origAge, newAge) {
    //will need to insert each value for each table
    //creat array with 5th and 95th
    var oM = "M" + origAge;
    var nM;
    if (GAA == 99 && temp <999) {
        //will add a special note page on the side...
        newAge = temp;
    }
    else if (temp == 999 && GAA <= 99) {
            nM ="M" + newAge;
            expectedRange[0][2] = preemieLength[oM][1];
            expectedRange[0][3] = preemieHC[oM][1];
            expectedRange[0][6] = preemieWT[oM][1];
            lowPercentiles[0] = preemieLength[oM][0];
            lowPercentiles[1] = preemieHC[oM][0];
            lowPercentiles[2] = preemieWT[oM][0];
            highpercentiles[0] = preemieLength[oM][2];
            highpercentiles[1] = preemieHC[oM][2];
            highpercentiles[2] = preemieWT[oM][2];
                if (gender == "male"){
                    correctedRange[0][2] = CDCML[nM][1];
                    correctedRange[0][3] = CDCMHC[nM][1];
                    correctedRange[0][6] = CDCMWT[nM][1];
                    correctedRange[0][4] = liveMale[nM][0];
                    correctedRange[0][5] = liveMale[nM][1];


                    clowPercentiles[0] = CDCML[nM][0];
                    clowPercentiles[1] = CDCMHC[nM][0];
                    clowPercentiles[2] = CDCMWT[nM][0];
                    chighPercentiles[0] = CDCML[nM][2];
                    chighPercentiles[1] = CDCMHC[nM][2];
                    chighPercentiles[2] = CDCMWT[nM][2];

                }
                else {
                    
                    correctedRange[0][2] = CDCFL[nM][1];
                    correctedRange[0][3] = CDCFHC[nM][1];
                    correctedRange[0][6] = CDCFWT[nM][1];
                    correctedRange[0][4] = liveFemale[nM][0];
                    correctedRange[0][5] = liveFemale[nM][1];

                    clowPercentiles[0] = CDCFL[nM][0];
                    clowPercentiles[1] = CDCFHC[nM][0];
                    clowPercentiles[2] = CDCFWT[nM][0];
                    chighPercentiles[0] = CDCFL[nM][2];
                    chighPercentiles[1] = CDCFHC[nM][2];
                    chighPercentiles[2] = CDCFWT[nM][2];

                }

    }
    else {
        nM = "M" + newAge;
        // mini = dataTable[myMean][index] - dataTable[mySD][index] * 2;
        switch (tableID) {
            //preemies will need for expected and outside range  
            case 0:
                expectedRange[0][2] = preemieLength[oM][1];
                expectedRange[0][3] = preemieHC[oM][1];
                expectedRange[0][6] = preemieWT[oM][1];
                lowPercentiles[0] = preemieLength[oM][0];
                lowPercentiles[1] = preemieHC[oM][0];
                lowPercentiles[2] = preemieWT[oM][0];
                highpercentiles[0] = preemieLength[oM][2];
                highpercentiles[1] = preemieHC[oM][2];
                highpercentiles[2] = preemieWT[oM][2];

                //need to make sure <50!
                if (origAge != newAge && detAge != "None") {

                    correctedRange[0][2] = preemieLength[nM][1];
                    correctedRange[0][3] = preemieHC[nM][1];
                    correctedRange[0][6] = preemieWT[nM][1];



                    clowPercentiles[0] = preemieLength[nM][0];
                    clowPercentiles[1] = preemieHC[nM][0];
                    clowPercentiles[2] = preemieWT[nM][0];
                    chighPercentiles[0] = preemieLength[nM][2];
                    chighPercentiles[1] = preemieHC[nM][2];
                    chighPercentiles[2] = preemieWT[nM][2];
                }

                break;

            //CDC -split into each part 
            case 1:
                if (gender == 'male') {
                    expectedRange[0][2] = CDCML[oM][1];
                    expectedRange[0][3] = CDCMHC[oM][1];
                    expectedRange[0][6] = CDCMWT[oM][1];
                    expectedRange[0][4] = liveMale[oM][0];
                    expectedRange[0][5] = liveMale[oM][1];

                    lowPercentiles[0] = CDCML[oM][0];
                    lowPercentiles[1] = CDCMHC[oM][0];
                    lowPercentiles[2] = CDCMWT[oM][0];
                    highpercentiles[0] = CDCML[oM][2];
                    highpercentiles[1] = CDCMHC[oM][2];
                    highpercentiles[2] = CDCMWT[oM][2];

                    if (origAge != newAge && detAge != "None") {
                        correctedRange[0][2] = CDCML[nM][1];
                        correctedRange[0][3] = CDCMHC[nM][1];
                        correctedRange[0][6] = CDCMWT[nM][1];
                        correctedRange[0][4] = liveMale[nM][0];
                        correctedRange[0][5] = liveMale[nM][1];


                        clowPercentiles[0] = CDCML[nM][0];
                        clowPercentiles[1] = CDCMHC[nM][0];
                        clowPercentiles[2] = CDCMWT[nM][0];
                        chighPercentiles[0] = CDCML[nM][2];
                        chighPercentiles[1] = CDCMHC[nM][2];
                        chighPercentiles[2] = CDCMWT[nM][2];


                    };

                }
                else {
                    expectedRange[0][2] = CDCFL[oM][1];
                    expectedRange[0][3] = CDCFHC[oM][1];
                    expectedRange[0][6] = CDCFWT[oM][1];
                    expectedRange[0][4] = liveFemale[oM][0];
                    expectedRange[0][5] = liveFemale[oM][1];

                    //4 cc 5 ac
                    lowPercentiles[0] = CDCFL[oM][0];
                    lowPercentiles[1] = CDCFHC[oM][0];
                    lowPercentiles[2] = CDCFWT[oM][0];
                    highpercentiles[0] = CDCFL[oM][2];
                    highpercentiles[1] = CDCFHC[oM][2];
                    highpercentiles[2] = CDCFWT[oM][2];

                    if (origAge != newAge && detAge != "None" && tine == false) {
                        correctedRange[0][2] = CDCFL[nM][1];
                        correctedRange[0][3] = CDCFHC[nM][1];
                        correctedRange[0][6] = CDCFWT[nM][1];
                        correctedRange[0][4] = liveFemale[nM][0];
                        correctedRange[0][5] = liveFemale[nM][1];

                        clowPercentiles[0] = CDCFL[nM][0];
                        clowPercentiles[1] = CDCFHC[nM][0];
                        clowPercentiles[2] = CDCFWT[nM][0];
                        chighPercentiles[0] = CDCFL[nM][2];
                        chighPercentiles[1] = CDCFHC[nM][2];
                        chighPercentiles[2] = CDCFWT[nM][2];
                    }




                }
                break;
        }
    }
}

var id = [];

//s3dbc.setKey(key);
//s3dbc.setDeployment(s3dbURL);
var loader = document.getElementById("ajaxLoading");

function testmyDB(){
    //var d = new Date();
    //d.getDate + " " + d.getHours
    var insertAge = insertAges();
   // var h = 0;
   // if (h == 100) {
    console.log(insertAge[0] + " " + typeof insertAge[0]);
    console.log(insertAge[1]);
    s3dbc.insertItem(3091, caseNumber.value, (function (err, id) {
        //will just create a statement for all my data (actualrange)
        console.log(id)
        loader.style.display = "block";
        //console.log(err, id);
        //console.log(actualRange);
        s3dbc.insertStatement(id[0].item_id, 3185, disorder.value, (function () {
            s3dbc.insertStatement(id[0].item_id, 3969, geneticsInfo.value, (function () {
                s3dbc.insertStatement(id[0].item_id, 3973, culture.value, (function () {
                    s3dbc.insertStatement(id[0].item_id, 3193, insertAge[0], (function () {
                        s3dbc.insertStatement(id[0].item_id, 3687, insertAge[1], (function () {
                            s3dbc.insertStatement(id[0].item_id, 3691, liveBorn, (function () {
                                s3dbc.insertStatement(id[0].item_id, 3695, mac.options[mac.selectedIndex].value, (function () {
                                    s3dbc.insertStatement(id[0].item_id, 3162, gender, (function (err) {
                                        s3dbc.insertStatement(id[0].item_id, 3197, race, (function (err) {
                                            s3dbc.insertStatement(id[0].item_id, 4374, actualRange, (function (err) {
                                                document.getElementById("ajaxLoading").style.display = "none";
                                                alert("Your data has been added!")

                                            }));
                                        }));
                                    }));
                                }));
                            }));
                        }));
                    }));
                }));
            }));
        }));
    }));
    

};

function insertAges (){
    var age1;
    var age2;

    if (liveBorn == false) {
        age1 = GA.value + " wks";
      if (GAA >= 99) {
          age2 = lvAge + " mos";
      }
      else { age2 = GAA + " wks"; }
    }

    if (liveBorn == true) {
        if (AB.value != "" && GAA < 50) {
            age1 = GA.value + " wks";
            age2 = GAA + " wks";
        }
        else if (AB.value != "" && GAA >= 99) {
            age1 = GA.value + " wks";
            age2 = lvAge + " mos";
        }
        else if (tiny == true) {
            age1 = age.value + " mos"
            age2 = GAA + " wks";
        }
        else {
            age1 = age.value + " mos";
            age2 = lvAge + " mos";
        }
    }
   
    return [age1, age2];
};

var loginUser = function () {
    s3dbc.setDeployment(s3dbURL);

    s3dbc.login(userName.value, password.value, (function (err, key) {

        if (err !== null) {

            console.error("Login failed.", err);
        } else {
            console.log("Login succeeded.", key);

            // Third step: set key.
            s3dbc.setKey(key);
            localStorage.setItem("key", key);
            $('#hiddenLogin').fadeOut('fast');
            $('#loggedInCurrently').fadeTo('fast', 1);
        }
        /*
        s3dbc.login(userName, password, (function (err, key) {
        console.log(key);
        localStorage.setItem("key", key);
        */
        
    }));
};

/*
var displayFileInfoByCollectionAndRule=function(collectionID,ruleID){
      // display file name, file size and url of selected file
     s3dbc.selectItemsByCollection(collectionID, function(err,results){
          console.log(err);
          console.log(results);
          var itemsId=[];
          for(var i=0;i<results.length;i++){
              itemsId[i]=results[i].item_id;
          }
          
     });

 };
 */

 function loadLoginForm(){
    // $('#removeLogin').fadeOut('fast');
     document.getElementById("removeLogin").style.display = "none";
     //document.getElementById('loginArea').style.top = '2%';
     $('#hiddenLogin').fadeTo('fast', 1);
     
 }

 function logoutProc() {
     s3dbc.logout(); 
     localStorage .clear ();
     $('#loggedInCurrently').fadeOut('fast');
     $('#removeLogin').fadeTo('fade', 1);
 }


 function checkNaN (x, myLabels, stopNumber){
     //for (o = 0; o < labels.length; o++) {
     for (i = 0; i <= myLabels.length - stopNumber; i++) {
         if (i > 0) {
             if ((i == 1 && isNaN(x[i])) || (i ==1 && x[i] == "") || (i ==1 && x[i] == "NaN")){
                 x[i] = ""
             }
             else if (isNaN(x[i]) || x[i] == NaN || x[i] == 0) {
             if (i != 3 && i != 8) {
                 //i!=4    && i != 9
                 x[i] = "NKV";
                 if (i == 4 || i ==9){
                     x[i - 1] = "NKV";
                 }
             }
             else {
                 x[i] = x[i] + "";
             };
             }
             
             else {
                 x[i] = x[i] + "";
            
                 //x[i] = x[i].toString();
             }
             //alert(x[o][i] + " " + typeof x[o][i]);
         };

     }
     //}
     return x;
 }
 var results = [];

 function readData () {
   //  alert ("I'm here")
     var myId = "4222";
     var dataRuleId = "3189";
    s3dbc.selectItem(4222, (function (err, results) {
         console.log(results);
         
     }));
     s3dbc.selectStatementsByRuleAndItem(dataRuleId, myId, function (err, results) {
         console.log(results);
         console.log(results[0].value.split(","));
     });
 }
