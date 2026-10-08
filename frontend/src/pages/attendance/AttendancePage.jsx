import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceSubjectCard from "../../components/attendance/AttendanceSubjectCard";
import { attendanceData, getAttendanceDecimal } from "../../data/attendanceData";

export default function AttendancePage() {
  const navigate = useNavigate();
  const [selectedSubjectId, setSelectedSubjectId] = useState(attendanceData[0]?.id || 1);
  const [futureClasses, setFutureClasses] = useState(10);
  const [plannedAttend, setPlannedAttend] = useState(8);
  const [targetPercentage, setTargetPercentage] = useState(85);

  const selectedSubject = attendanceData.find((item) => item.id === Number(selectedSubjectId));

  const prediction = useMemo(() => {
    if (!selectedSubject) return null;
    const currentAttended = Number(selectedSubject.attended) || 0;
    const currentTotal = Number(selectedSubject.total) || 0;
    const future = Math.max(0, Number(futureClasses) || 0);
    const attend = Math.min(future, Math.max(0, Number(plannedAttend) || 0));
    const skip = future - attend;
    const futureAttended = currentAttended + attend;
    const futureTotal = currentTotal + future;
    const predicted = getAttendanceDecimal(futureAttended, futureTotal);
    const target = Number(targetPercentage) / 100;
    const minimumToReachTarget = Math.max(0, Math.ceil(target * futureTotal - currentAttended));
    const canReach = minimumToReachTarget <= future;
    const maxSkipAtTarget = Math.max(0, future - minimumToReachTarget);

    return {
      currentAttended,
      currentTotal,
      currentPercentage: getAttendanceDecimal(currentAttended, currentTotal),
      future,
      attend,
      skip,
      futureAttended,
      futureTotal,
      predicted,
      minimumToReachTarget,
      canReach,
      maxSkipAtTarget,
    };
  }, [selectedSubject, futureClasses, plannedAttend, targetPercentage]);

  const resetPredictor = () => {
    setFutureClasses(10);
    setPlannedAttend(8);
    setTargetPercentage(85);
  };

  return (
    <div className="attendance-page">
      <div className="attendance-page-header">
        <div>
          <div className="attendance-breadcrumb">Dashboard <span>/</span> Attendance</div>
          <h1>Attendance</h1>
          <p>View attendance subject-wise and plan your future attendance.</p>
        </div>
        <button className="attendance-dashboard-btn" onClick={() => navigate("/dashboard")}>← Dashboard</button>
      </div>

      <section className="subject-predictor attendance-predictor-top">
        <div className="subject-predictor-header">
          <div>
            <span className="detail-small-label">SMART ATTENDANCE PLANNER</span>
            <h2>Future Attendance Predictor</h2>
            <p>This calculation applies only to the selected subject.</p>
          </div>
          <button className="predictor-reset" onClick={resetPredictor}>Reset</button>
        </div>

        <div className="predictor-subject-select">
          <label>Select Subject</label>
          <select value={selectedSubjectId} onChange={(e) => { setSelectedSubjectId(Number(e.target.value)); resetPredictor(); }}>
            {attendanceData.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.code} — {subject.name}</option>
            ))}
          </select>
        </div>

        {prediction && (
          <>
            <div className="subject-predictor-controls">
              <div className="predictor-box">
                <div className="predictor-box-icon calendar">📅</div>
                <div className="predictor-box-text"><span>Upcoming Classes</span><small>Future classes</small></div>
                <div className="number-stepper">
                  <button onClick={() => setFutureClasses((v) => Math.max(1, v - 1))}>−</button>
                  <strong>{futureClasses}</strong>
                  <button onClick={() => setFutureClasses((v) => v + 1)}>+</button>
                </div>
              </div>

              <div className="predictor-box">
                <div className="predictor-box-icon attend">✓</div>
                <div className="predictor-box-text"><span>I'll Attend</span><small>Planned attendance</small></div>
                <div className="number-stepper">
                  <button disabled={plannedAttend <= 0} onClick={() => setPlannedAttend((v) => Math.max(0, v - 1))}>−</button>
                  <strong>{plannedAttend}</strong>
                  <button disabled={plannedAttend >= futureClasses} onClick={() => setPlannedAttend((v) => Math.min(futureClasses, v + 1))}>+</button>
                </div>
              </div>

              <div className="predictor-box">
                <div className="predictor-box-icon skip">×</div>
                <div className="predictor-box-text"><span>I'll Skip</span><small>Automatically calculated</small></div>
                <div className="calculated-number">{prediction.skip}</div>
              </div>

              <div className="predictor-box">
                <div className="predictor-box-icon target">%</div>
                <div className="predictor-box-text"><span>Target</span><small>Minimum attendance</small></div>
                <div className="number-stepper">
                  <button disabled={targetPercentage <= 50} onClick={() => setTargetPercentage((v) => Math.max(50, v - 1))}>−</button>
                  <strong>{targetPercentage}%</strong>
                  <button disabled={targetPercentage >= 100} onClick={() => setTargetPercentage((v) => Math.min(100, v + 1))}>+</button>
                </div>
              </div>
            </div>

            <div className={`subject-prediction-result ${prediction.predicted >= targetPercentage ? "safe" : "danger"}`}>
              <div className="prediction-result-main">
                <span>Predicted {selectedSubject.code} Attendance</span>
                <strong>{prediction.predicted}%</strong>
                <div className="prediction-bar"><div style={{ width: `${Math.min(100, prediction.predicted)}%` }} /><span style={{ left: `${Math.min(100, targetPercentage)}%` }} /></div>
                <div className="prediction-bar-labels"><span>0%</span><span>Target {targetPercentage}%</span><span>100%</span></div>
              </div>
              <div className="prediction-result-divider" />
              <div className="prediction-mini-stat"><span>Current</span><strong>{prediction.currentAttended}/{prediction.currentTotal}</strong><small>{prediction.currentPercentage}%</small></div>
              <div className="prediction-mini-stat"><span>After Plan</span><strong>{prediction.futureAttended}/{prediction.futureTotal}</strong><small>{prediction.predicted}%</small></div>
            </div>

            <div className="subject-smart-result">
              <div className={`smart-result-icon ${prediction.predicted >= targetPercentage ? "safe" : "danger"}`}>
                {prediction.predicted >= targetPercentage ? "✓" : "!"}
              </div>
              <div>
                <strong>{prediction.predicted >= targetPercentage ? "Your plan is safe" : "Your plan is below the target"}</strong>
                <p>
                  {prediction.canReach
                    ? <>To reach <b>{targetPercentage}%</b>, attend at least <b>{prediction.minimumToReachTarget}</b> of the next <b>{prediction.future}</b> classes. At that target, you can skip up to <b>{prediction.maxSkipAtTarget}</b>.</>
                    : <>Even attending all <b>{prediction.future}</b> upcoming classes will not reach <b>{targetPercentage}%</b>. You need additional future classes.</>}
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="attendance-subject-section">
        <div className="attendance-section-header">
          <div>
            <span className="section-label">ACADEMICS</span>
            <h2>Subject-wise Attendance</h2>
            <p>Overall attendance is shown on Overview. This page is subject-specific.</p>
          </div>
          <div className="subject-count">{attendanceData.length} Subjects</div>
        </div>

        <div className="attendance-subject-grid">
          {attendanceData.map((subject) => (
            <AttendanceSubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => navigate(`/attendance/${subject.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
