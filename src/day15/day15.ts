import { getPuzzleInput } from "../getPuzzleInput";

interface Position {
  x: number;
  y: number;
}

interface Borders {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Sensor {
  position: Position;
  closestBeacon: number;
}

enum PositionType {
  Beacon = "B",
  Sensor = "S",
  Empty = "#",
  Unknown = ".",
}

class Sensor {
  private _position: Position;
  private _beacon: Position = { x: 0, y: 0 };
  private _closestBeaconDistance = Infinity;

  constructor(position: Position) {
    this._position = position;
  }

  distanceToPoint(position: Position): number {
    return (
      Math.abs(position.x - this._position.x) +
      Math.abs(position.y - this._position.y)
    );
  }

  addBeacon(position: Position): Borders {
    this._beacon = position;

    this._closestBeaconDistance =
      this.distanceToPoint(position);

    return {
      minX: this._position.x - this._closestBeaconDistance,
      maxX: this._position.x + this._closestBeaconDistance,
      minY: this._position.y - this._closestBeaconDistance,
      maxY: this._position.y + this._closestBeaconDistance,
    };
  }

  getRelativePositionType(
    { x, y }: Position,
    typePos = PositionType.Unknown
  ): PositionType {
    if (
      typePos === PositionType.Beacon ||
      typePos === PositionType.Sensor
    ) {
      return typePos;
    }

    if (this._beacon.x === x && this._beacon.y === y) {
      return PositionType.Beacon;
    }

    if (this._position.x === x && this._position.y === y) {
      return PositionType.Sensor;
    }

    if (typePos === PositionType.Empty) {
      return typePos;
    }

    return this.distanceToPoint({ x, y }) <=
      this._closestBeaconDistance
      ? PositionType.Empty
      : PositionType.Unknown;
  }

  isYinRange(y: number): boolean {
    return (
      y >= this._position.y - this._closestBeaconDistance &&
      y <= this._position.y + this._closestBeaconDistance
    );
  }

  isXinRange(minx: number, maxx: number): boolean {
    return (
      maxx >=
        this._position.x - this._closestBeaconDistance &&
      minx <= this._position.x + this._closestBeaconDistance
    );
  }

  getFirstEmpties(y: number): {
    left: number;
    right: number;
  } {
    const yDiff = Math.abs(this._position.y - y);
    const maxX =
      this._position.x +
      this._closestBeaconDistance -
      yDiff;
    const minX =
      this._position.x -
      this._closestBeaconDistance +
      yDiff;
    return { left: minX, right: maxX };
  }
}

export const day15: Exercise = async (checkY = 2000000) => {
  const input = (await getPuzzleInput(15)).split("\n");

  const sensorList: Sensor[] = [];
  const beaconList: Position[] = [];

  const borders: Borders = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };

  for (const line of input) {
    const match =
      /x=(?<sx>-?\d*).*y=(?<sy>-?\d*).*x=(?<bx>-?\d*).*y=(?<by>-?\d*)/gm.exec(
        line
      );

    if (match?.groups?.bx) {
      const sx = Number(match.groups.sx);
      const sy = Number(match.groups.sy);
      const bx = Number(match.groups.bx);
      const by = Number(match.groups.by);

      const sensor = new Sensor({ x: sx, y: sy });
      const beacon = { x: bx, y: by };
      const {
        minX: nMinX,
        maxX: nMaxX,
        minY: nMinY,
        maxY: nMaxY,
      } = sensor.addBeacon(beacon);

      borders.minX = Math.min(nMinX, bx, borders.minX);
      borders.maxX = Math.max(nMaxX, bx, borders.maxX);
      borders.minY = Math.min(nMinY, by, borders.minY);
      borders.maxY = Math.max(nMaxY, by, borders.maxY);

      sensorList.push(sensor);
      beaconList.push(beacon);
    }
  }

  let part1 = 0;
  for (let x = borders.minX; x <= borders.maxX; x++) {
    let posType = PositionType.Unknown;

    for (const sensor of sensorList) {
      posType = sensor.getRelativePositionType(
        { x, y: checkY },
        posType
      );
    }

    if (posType === PositionType.Empty) {
      part1++;
    }
  }

  let part2 = 0;

  //get only the sensors that are in the X range
  const auxList = sensorList.filter((s) =>
    s.isXinRange(0, checkY * 2)
  );
  for (let y = 0; y <= checkY * 2 && part2 === 0; y++) {
    //get only the sensors that are in the y range (pretty much all of them I believe)
    const l = auxList.filter((s) => s.isYinRange(y));

    // for said y get the leftmost and rightmost known position of each sensor
    // sort them by rightmost location
    let aux = l
      .map((s) => s.getFirstEmpties(y))
      .sort((a, b) => b.right - a.right);

    // loop through the x axis
    for (let x = 0; x <= checkY * 2; ) {
      //remove all that have the rightmost behind our x at this time
      aux = aux.filter((s) => s.right > x);

      let auxX = x;
      // since they're ordered, if the left is bigger than the x, then we can jump to the right+1
      for (const { left, right } of aux) {
        if (auxX >= left) {
          auxX = right + 1;
        }
      }

      // if aux and x are the same means that we didn't jump
      // this means no scanner has this position in range
      // aka our solution and holy grail
      if (auxX === x) {
        part2 = x * 4000000 + y;
        break;
      }
      x = auxX;
    }
  }

  return { part1, part2 };
};
