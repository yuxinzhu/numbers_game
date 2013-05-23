function calculatorController($scope) {

    var STORAGE_ID = 'numbers-game-storage';

    $scope.getCourses = function() {
      console.log('retrieving');
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    }

    $scope.storeCourses = function(courses) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(courses));
    }

    $scope.GPA = 0;
    $scope.majorGPA = 0;
    $scope.courseUnits = 0.5; //default value
    $scope.letterGrade = "A-";
    $scope.letterGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", "P", "NP"];
    $scope.courses = $scope.getCourses();

    $scope.init = function () {
        $scope.updateGPA();
    };


    $scope.letterToGPA = function(letterGrade) {
        var GPADict = {
            "A+": 4.0, "A": 4.0, "P": 0, "A-": 3.7,
            "B+": 3.3, "B": 3.0, "B-": 2.7,
            "C+": 2.3, "C": 2.0, "C-": 1.7,
            "D": 1.0, "F": 0, "NP": 0
        };
        return GPADict[letterGrade];
    };

    $scope.addCourse = function() {
        $scope.courses.push({
            name: $scope.courseName,
            letterGrade: $scope.letterGrade,
            units: $scope.courseUnits,
            major: $scope.majorBoolean,
            show: true,
            gradePoint: $scope.letterToGPA($scope.letterGrade) * $scope.courseUnits,
        });
        $scope.courseName = '';
        $scope.gpa = $scope.updateGPA();
        $scope.storeCourses($scope.courses);
    }

    $scope.updateGPA = function() {
        var tempMajor = $scope.calculateGPA(true);
        var temp = $scope.calculateGPA(false);

        console.log(tempMajor);
        console.log(temp);
        console.log();

        if (!isNaN(tempMajor)){
            $scope.majorGPA = Math.round(tempMajor*100)/100;
        } else { $scope.majorGPA = 0; };

        if (!isNaN(temp)){
            $scope.GPA = Math.round(temp*100)/100;
        } else { $scope.GPA = 0; };
    };

    $scope.calculateGPA = function(majorGPA) {
        console.log("hello!");
        var relevantCourses = _.filter($scope.courses, function(course) { return course.letterGrade != "P" && course.letterGrade != "NP" && course.show != false});
        if(majorGPA){
            relevantCourses = _.filter(relevantCourses, function(course) { return course.major == true });
        }
        var totalGrade = _.reduce(relevantCourses, function(memo, course){ return memo + course.gradePoint; }, 0);
        var totalUnits = _.reduce(relevantCourses, function(memo, course){ return memo + course.units; }, 0);
        return totalGrade/totalUnits;
    };

  $scope.removeCourse = function(course) {
    $scope.courses.splice($scope.courses.indexOf(course), 1);
    $scope.updateGPA();
    $scope.storeCourses($scope.courses)
  };

  $scope.incrementCourse = function(course) {
    var index = $scope.letterGrades.indexOf(course.letterGrade);
    console.log(index);
    if (index != 0) {
      course.letterGrade = $scope.letterGrades[--index];
      course.gradePoint = $scope.letterToGPA(course.letterGrade) * course.units;
      $scope.updateGPA();
      $scope.storeCourses($scope.courses);
    };
  };

  $scope.decrementCourse = function(course) {
    var index = $scope.letterGrades.indexOf(course.letterGrade);
    console.log(index);
    if (index != $scope.letterGrades.length-1) {
      course.letterGrade = $scope.letterGrades[++index];
      course.gradePoint = $scope.letterToGPA(course.letterGrade) * course.units;
      $scope.updateGPA();
      $scope.storeCourses($scope.courses);
    };
  };

  $scope.showCourse = function(course) {
    course.show = !course.show;
    $scope.updateGPA();
    $scope.storeCourses($scope.courses);
  };

};
