declare module 'astronomia' {
  export namespace solar {
    function toJDE(year: number, month: number, day: number): number;
    function apparentLongitude(T: number): number;
  }

  export namespace julian {
    function JDEToJulianMillennium(jde: number): number;
  }

  export namespace planetposition {
    function position(body: string, jde: number): {
      lon: number;
      lat: number;
      range: number;
    };
  }
} 