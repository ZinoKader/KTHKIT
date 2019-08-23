export const formatStatisticsData = rawData => {
  const flattenedData = Object.keys(rawData).map(key => {
    const flattened = {
      group_key: key,
      ...rawData[key]["grade"],
      AColor: "hsl(122, 39%, 49%)",
      BColor: "hsl(122, 40%, 58%)",
      CColor: "hsl(66, 100%, 42%)",
      DColor: "hsl(63, 80%, 60%)",
      EColor: "hsl(54, 100%, 62%)",
      FxColor: "hsl(1, 100%, 59%)",
      FColor: "hsl(359, 61%, 40%)",
      ...rawData[key]
    };
    delete flattened.grade;
    return flattened;
  });

  console.log(flattenedData);
  return flattenedData;
};
