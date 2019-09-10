var requestURL="http://localhost:3000/rajyasabha";
var request=new XMLHttpRequest();
request.open('GET',requestURL);
request.responseType='json';
request.send();
var data;
request.onload=function(){
    data=request.response;
}




function searchtable(arr,nam,ind){
    var temp=[];
    var t=arr.length;
    for(var i=0;i<t;i+=1)
    {
        if(arr[i][ind].toLowerCase().trim()==nam.toLowerCase())
        {
            temp.push(arr[i]);
        }
    }
    return temp;
}


function showtable(){
    document.getElementById('tableheader').innerHTML="<u>Data Table</u>";
    var headertitle = ['ID', 'ANSWER DATE', 'MINISTRY', 'QUESTION TYPE', 'QUESTION NO', 'QUESTION BY', 'QUESTION TITLE', 'QUESTION DESCRIPTION', 'ANSWER'];
    var mainarray=[];
    for(var i=0;i<data.length;i+=1)
    {
        var temp=[];
        temp.push(data[i].id);
        temp.push(data[i].answer_date);
        temp.push(data[i].ministry);
        temp.push(data[i].question_type);
        temp.push(data[i].question_no);
        temp.push(data[i].question_by);
        temp.push(data[i].question_title);
        temp.push(data[i].question_description);
        temp.push(data[i].answer);

        mainarray.push(temp);
    }
    if(document.getElementById('searchname').value!=""){
        mainarray=searchtable(mainarray,document.getElementById('searchinput').value.trim(),2);
    }

    
    var pageValue = document.getElementById('pageinput').value;

    var showarray = [headertitle];
    
    for (var i = (pageValue - 1) * 10 ; i < pageValue * 10; i += 1) {
        if(i==mainarray.length) break;
        showarray.push(mainarray[i]);
    }
    document.getElementById('table').innerHTML="";
    var tr = d3.select("body>div#table")
    .append("table") 
    .selectAll("tr") 
    .data(showarray)  
    .enter() 
    .append("tr"); 

    var td = tr.selectAll("td")
    .data(function(d) {
        return d;
    })
    .enter() 
    .append("td") 
    .text(function(d) {
        return d; 
    });
}

function showchart(){
    document.getElementById('chartheader').innerHTML="<u>Bar Graph Showing Total Number of Questions by a Specific Ministry</u>";
    var ministryName = [];
            
    for (var i = 0; i < data.length; i += 1) {
        let flag = 0;
        for (var j = 0; j < ministryName.length; j += 1) {
            if (ministryName[j][0].trim()==(data[i].ministry.trim())) {
                ministryName[j][1] += 1;
                flag = 1;
                break;
            }
        }
        if (flag == 0) {
            ministryName.push([data[i].ministry.trim(), 1]);
            }
        }
        var dataset = [];
        var name = [];
        for (var i = 0; i < ministryName.length; i += 1) {
            dataset.push(ministryName[i][1]);
            name.push(ministryName[i][0]);
        }
        
        var svgWidth = 1000,
            svgHeight = dataset.length * 20,
            barPadding = 5;
        var barHeight = (svgHeight / dataset.length);

        var svg = d3.select('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        svg.selectAll('rect')
            .data(ministryName)
            .enter()
            .append('rect')
            .attr("width", function(d) {
                return d[1];
            })
            .attr('x', function(d) {
                return svgWidth - d[1];
            })
            .attr('height', barHeight - barPadding)
            .attr('transform', function(d, i) {
                var translate = [svgWidth, barHeight * (i + 1)];
                return 'translate(' + translate + ')' + 'rotate(180)';
            });
        svg.selectAll('text')
            .data(ministryName)
            .enter()
            .append('text')
            .text(function(d) {
                return '(' + d[1] + ') ' + d[0];
            })
            .attr("x", function(d, i) {
                return d[1] + 30;
            })
            .attr('y', function(d, i) {
                return barHeight * (i + 1);
            });
}