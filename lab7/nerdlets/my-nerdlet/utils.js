import uuidv4 from 'uuid';
import randomColor from 'randomcolor';

export const generateForecastData = (data) => {
  const forecast = {
      metadata: {
          name: 'Forecast',
          label: 'Forecast',
          id: uuidv4(),
          viz: 'main'
      },
      data: []
  };
  //loop through each point
  data.data.forEach(pt => {
      forecast.data.push({
          x: pt.x,
          y: randomForecast(pt.y)
      })
  });
  forecast.metadata.color = randomColor();

  return forecast;
}

const percentages = [0.9, 1.1, 1.03, 1.5, 2, 1.17, 0.85, 0.7, 1.7, 0.92]

const randomForecast = (x) => {
  const random = percentages[Math.floor(Math.random() * percentages.length)]
  return x * random
}