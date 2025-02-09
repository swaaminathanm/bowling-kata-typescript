import { Bonus } from './Bonus';
import { IFrame } from '../frame/IFrame';
import { Roll } from '../Roll';
import { Rack } from '../Rack';

export interface IBonusEvaluator {
    getApplicableBonus(frame: IFrame, roll: Roll, rack: Rack): Bonus | null;
}