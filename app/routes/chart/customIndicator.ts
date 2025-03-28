export const customIndicator = {
    name: "My Custom Indicator",
    metainfo: {
      _metainfoVersion: 51,
      id: "custom_indicator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "My Custom Indicator",
      description: "Özel hesaplamalar içeren indikatör",
      shortDescription: "Custom IND",
      is_hidden_study: false,
      is_price_study: true, // Fiyat grafiği üzerinde mi gösterilecek?
      plots: [
        { id: "plot_0", type: "line" },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            color: "#FF5733",
          },
        },
        inputs: {},
      },
      inputs: [],
    },
  
    constructor: function () {
      return {
        update: function (context: any, input: any) {
          // Basit bir hareketli ortalama hesaplaması
          let sum = 0;
          const length = 14; // Örnek olarak 14 periyotluk bir indikatör
          for (let i = 0; i < length; i++) {
            sum += context.newSeries[i];
          }
          const movingAverage = sum / length;
          return [movingAverage];
        },
      };
    },
  };
  