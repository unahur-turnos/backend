export const index = async (req, res) => {
  const data = {
    ocupacion: {
      aforo: [
        { fecha: 'lun 1/3', total: 70 },
        { fecha: 'mar 2/3', total: 75 },
        { fecha: 'mié 3/3', total: 80 },
        { fecha: 'jue 4/3', total: 80 },
        { fecha: 'vie 5/3', total: 85 },
      ],

      turnos: [
        { fecha: 'lun 1/3', total: 20 },
        { fecha: 'mar 2/3', total: 23 },
        { fecha: 'mié 3/3', total: 19 },
        { fecha: 'jue 4/3', total: 40 },
        { fecha: 'vie 5/3', total: 60 },
      ],
    },
  };

  res.send({ data });
};
