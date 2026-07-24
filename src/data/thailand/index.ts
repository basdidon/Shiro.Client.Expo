import districtsData from "./districts.json";
import provincesData from "./provinces.json";
import subdistrictsData from "./subdistricts.json";

export interface ThaiProvince {
    id: number;
    provinceCode: number;
    provinceNameEn: string;
    provinceNameTh: string;
}

export interface ThaiDistrict {
    id: number;
    provinceCode: number;
    districtCode: number;
    districtNameEn: string;
    districtNameTh: string;
    postalCode: number;
}

export interface ThaiSubdistrict {
    id: number;
    provinceCode: number;
    districtCode: number;
    subdistrictCode: number;
    subdistrictNameEn: string;
    subdistrictNameTh: string;
    postalCode: number;
}

export const thaiProvinces = (provincesData as ThaiProvince[]).sort((a, b) =>
    a.provinceNameTh.localeCompare(b.provinceNameTh, "th"),
);
export const thaiDistricts = districtsData as ThaiDistrict[];
export const thaiSubdistricts = subdistrictsData as ThaiSubdistrict[];

export const getDistrictsByProvince = (provinceCode: number): ThaiDistrict[] =>
    thaiDistricts
        .filter((district) => district.provinceCode === provinceCode)
        .sort((a, b) => a.districtNameTh.localeCompare(b.districtNameTh, "th"));

export const getSubdistrictsByDistrict = (districtCode: number): ThaiSubdistrict[] =>
    thaiSubdistricts
        .filter((subdistrict) => subdistrict.districtCode === districtCode)
        .sort((a, b) => a.subdistrictNameTh.localeCompare(b.subdistrictNameTh, "th"));
