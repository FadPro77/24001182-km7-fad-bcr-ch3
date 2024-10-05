function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Binar {
  static populateCars = (cars) => {
    return cars.map((car) => {
      const timeAt = new Date();
      const oneMonthLater = new Date(timeAt);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      const randomTime = getRandomInt(
        timeAt.getTime(),
        oneMonthLater.getTime()
      );
      const availableAt = new Date(randomTime);

      return {
        ...car,
        availableAt,
      };
    });
  };

  static async listCars(filterer) {
    let cars;
    let cachedCarsString = localStorage.getItem("CARS");

    if (!!cachedCarsString) {
      const cacheCars = JSON.parse(cachedCarsString);
      cars = this.populateCars(cacheCars);
    } else {
      const response = await fetch(
        "https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/data/cars.min.json"
      );
      const body = await response.json();
      cars = this.populateCars(body);

      localStorage.setItem("CARS", JSON.stringify(cars));
    }

    if (filterer instanceof Function) return cars.filter(filterer);

    return cars;
  }
}
