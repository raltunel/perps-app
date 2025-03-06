export enum FormatTypes {
    EN = 'en-US',
    DE = 'de-DE',
    FR = 'fr-FR',
    SV = 'sv-SE',
}

export type NumFormat = {
    label: string;
    value: FormatTypes;
}

export const NumFormatTypes: NumFormat[] = [
    {
        label: '1,234.56',
        value: FormatTypes.EN
    },
    {
        label: '1.234,56',
        value: FormatTypes.DE
    },
    {
        label: '1234,56',
        value: FormatTypes.FR
    },
    {
        label: '1 234,56',
        value: FormatTypes.SV
    }

]