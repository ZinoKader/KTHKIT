const GROUP_ABBREVIATIONS = {
  CDATE: "D",
  CELTE: "E",
  CINEK: "I",
  CMAST: "M",
  CDEPR: "DP",
  CENMI: "EM",
  CINTE: "IT",
  CITEH: "IH",
  CLGYM: "CL",
  CMATD: "MD",
  CMEDT: "MT",
  CMETE: "ME",
  COPEN: "O",
  CSAMH: "S",
  CTKEM: "K",
  CBIOT: "BI",
  TCOMK: "KT",
  CTFYS: "F",
  CFATE: "FT",
  ALLA: "Σ",
  "EJ REG": "EJ",
  OMREG: "OM",
  ÖVRIGA: "ÖV"
};

const roundScale = (v, t, precision) =>
  Math.round(10 * precision * ((100 * v) / t)) / (10 * precision);

const abbreviateGroupName = name => {
  let isProgramme = !isNaN(name[name.length - 1]);
  let formattedName = isProgramme ? name.slice(0, name.length - 1) : name;
  if (Object.keys(GROUP_ABBREVIATIONS).includes(formattedName)) {
    return (
      GROUP_ABBREVIATIONS[formattedName] +
      (isProgramme ? name[name.length - 1] : "")
    );
  }
  return name;
};

// TODO: Format this in backend, add percentized and raw grades as objects and filter one out based on 'percentized' param
export const formatStatisticsData = (rawData, percentized = true) => {
  const formattedData = Object.keys(rawData).map(groupKey => {

    let percentageGrades = {};
    if (percentized) {
      const totalWriters = Object.values(rawData[groupKey]["grade"]).reduce(
        (acc, writers) => (acc += writers)
      );
      Object.keys(rawData[groupKey]["grade"]).map(gradeKey => {
        percentageGrades[gradeKey] = roundScale(
          rawData[groupKey]["grade"][gradeKey],
          totalWriters,
          1
        );
      });
    }

    const flattened = {
      group_key: abbreviateGroupName(groupKey),
      ...(percentized ? percentageGrades : rawData[groupKey]["grade"]),
      ...rawData[groupKey]
    };
    delete flattened.grade;

    return flattened;
  });

  return formattedData;
};
