export const formatStatisticsData = rawData => {
  const flattenedData = Object.keys(rawData).map(key => {
    const flattened = {
      group_key: key,
      ...rawData[key]["grade"],
      ...rawData[key]
    };
    delete flattened.grade;
    return flattened;
  });

  return flattenedData;
};
