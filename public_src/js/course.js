$(document).ready(function() {
  let no = $('.list-group-item').first()[0].dataset.courseno;
  $('.list-group-item').click(function() {
    let no = $(this).data("courseno");
    let year = $(this).data("year");
    let sem = $(this).data("sem");
    $('.list-group-item').removeClass('active')
    $(this).addClass('active');
    $.ajax({
      method: "POST",
      url: "/course/detail",
      data: {
        course_no: no,
        year: year,
        sem: sem
      }
    })
    .done(function(result) {
      console.log(result);
      result[0].ExamDate = new Date(result[0].ExamDate);
      var t = result[0].ExamDate.getDate() + "/" + (result[0].ExamDate.getMonth()+1)+"/"+result[0].ExamDate.getFullYear();
      var examtime = result[0].ExamTimeSt+" - "+result[0].ExamTimeFn;
      $('#title').html(result[0].CourseID +" "+ result[0].CourseInitial);
      $('#name_en').html(result[0].CourseName);
      $('#shortname').html(result[0].CourseInitial);
      $('#creditset').html(result[0].Credit);
      $('#prerequisite').html(result[0].Prerequisite.toString());
      $('#examdate').html(t);
      $('#examtime').html(examtime);
      if(result[0].MidExamDate){
        result[0].MidExamDate = new Date(result[0].MidExamDate);
        var tt = result[0].MidExamDate.getDate() + "/" + (result[0].MidExamDate.getMonth()+1)+"/"+result[0].MidExamDate.getFullYear();
        $('#midexamdate').html(tt);
        var midexamtime = result[0].MidExamTimeSt+" - "+result[0].MidExamTimeFn;
        $('#midexamtime').html(midexamtime);
      }
      else{
        $('#midexamdate').html("TDF");
        $('#midexamtime').html("TDF");
      }
      $('#sections').html('');
      for(let i=0;i<result[0].Sections.length;i++){
        console.log("i = "+i);
        console.log(result[0].Sections);
        var e = $(document.createElement('table'))
             .attr("class", 'table table-bordered');
        var content = '<tbody><tr><td class="course_title col-md-2"><b>Section Number</b></td>';
        content += '<td class="course_detail">'+result[0].Sections[i][0].SectionNumber+'</td></tr>';
        content += '<tr><td class="course_title"><b>สถานะ</b></td>';
        content += '<td class="course_detail">'+result[0].Sections[i][0].SecStatus+'</td></tr>';
        content += '<tr><td class="course_title"><b>จำนวนนิสิตที่รับได้</b></td>';
        content += '<td class="course_detail">'+result[0].Sections[i][0].StudentCapacity+'</td></tr>';
        content += '<tr><td class="course_title"><b>จำนวนนิสิตที่ลงทะเบียนเรียน</b></td>';
        content += '<td class="course_detail">'+result[0].Sections[i][0].NumberOfStudent+'</td></tr>';
        for(let j=0;j<result[0].Sections[i].length;j++){
            console.log("j = "+j);
            content += '<tr><td class="course_title"><b>วันเรียน #'+(j+1)+'</b></td>';
            content += '<td class="course_detail">'+result[0].Sections[i][j].TDayD+' '+result[0].Sections[i][j].TeachTimeStD+' - '+result[0].Sections[i][j].TeachTimeFnD+' ('+result[0].Sections[i][j].TeachStyleD+') '+'</td></tr>';
        }
        content += '</tbody>';
        e.after().html(content);
        e.appendTo("#sections");
      }

    });
  })
});
