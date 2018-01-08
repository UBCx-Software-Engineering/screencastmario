/*
/// <reference path="def/interfaces.d.ts"/>
/// <reference path="def/Keys.d.ts"/>
/// <reference path="def/jquery.d.ts"/>
*/


import {Level} from './Level';
import {GreenTurtle} from '../figures/GreenTurtle';
import {TurtleShell} from '../figures/TurtleShell';
import {PipePlant} from '../figures/PipePlant';
import {StaticPlant} from '../figures/StaticPlant';
import {SpikedTurtle} from '../figures/SpikedTurtle';
import {Gumpa} from '../figures/Gumpa';
import {Mario} from '../figures/Mario';
import {RightPipeGrass} from '../matter/RightPipeGrass';
import {LeftPipeGrass} from '../matter/LeftPipeGrass';
import {RightPipeSoil} from '../matter/RightPipeSoil';
import {MiddlePlantedSoil} from '../matter/MiddlePlantedSoil';
import {LeftPipeSoil} from '../matter/LeftPipeSoil';
import {LeftPlantedSoil} from '../matter/LeftPlantedSoil';
import {RightPlantedSoil} from '../matter/RightPlantedSoil';
import {TopRightCornerGrass} from '../matter/TopRightCornerGrass';
import {TopGrass} from '../matter/TopGrass';
import {TopLeftCornerGrass} from '../matter/TopLeftCornerGrass';
import {TopLeftGrass} from '../matter/TopLeftGrass';
import {TopLeftGrassSoil} from '../matter/TopLeftGrassSoil';
import {TopRightGrassSoil} from '../matter/TopRightGrassSoil';
import {RightBush} from '../matter/RightBush';
import {RightMiddleBush} from '../matter/RightMiddleBush';
import {MiddleBush} from '../matter/MiddleBush';
import {LeftMiddleBush} from '../matter/LeftMiddleBush';
import {LeftBush} from '../matter/LeftBush';
import {Soil} from '../matter/Soil';
import {RightSoil} from '../matter/RightSoil';
import {LeftSoil} from '../matter/LeftSoil';
import {TopRightGrass} from '../matter/TopRightGrass';
import {RightGrass} from '../matter/RightGrass';
import {LeftGrass} from '../matter/LeftGrass';
import {Stone} from '../matter/Stone';
import {TopRightRoundedGrass} from '../matter/TopRightRoundedGrass';
import {TopLeftRoundedGrass} from '../matter/TopLeftRoundedGrass';
import {BrownBlock} from '../matter/BrownBlock';
import {LeftTopPipe} from '../matter/LeftTopPipe';
import {RightPipe} from '../matter/RightPipe';
import {RightTopPipe} from '../matter/RightTopPipe';
import {LeftPipe} from '../matter/LeftPipe';
import {Coin} from '../items/Coin';
import {CoinBox} from '../items/CoinBox';
import {MultipleCoinBox} from '../items/MultipleCoinBox';
import {StarBox} from '../items/StarBox';
import {MushroomBox} from '../items/MushroomBox';


String.prototype.toUrl = function () {
    return 'url(' + this + ')';
};

Math.sign = function (x: number) {
    return x > 0 ? 1 : (x < 0 ? -1 : 0);
};

var assets: any = undefined;

/*
 * -------------------------------------------
 * DOCUMENT READY STARTUP METHOD
 * -------------------------------------------
 */
export function run(levelData: LevelFormat, controls: Keys, sounds?: SoundManager) {
    assets = {
        pipeplant:                    PipePlant,
        staticplant:                  StaticPlant,
        greenturtle:                  GreenTurtle,
        spikedturtle:                 SpikedTurtle,
        shell:                        TurtleShell,
        ballmonster:                  Gumpa,
        mario:                        Mario,
        pipe_right_grass:             RightPipeGrass,
        pipe_left_grass:              LeftPipeGrass,
        pipe_right_soil:              RightPipeSoil,
        pipe_left_soil:               LeftPipeSoil,
        planted_soil_left:            LeftPlantedSoil,
        planted_soil_middle:          MiddlePlantedSoil,
        planted_soil_right:           RightPlantedSoil,
        grass_top_right_rounded_soil: TopRightGrassSoil,
        grass_top_left_rounded_soil:  TopLeftGrassSoil,
        bush_right:                   RightBush,
        bush_middle_right:            RightMiddleBush,
        bush_middle:                  MiddleBush,
        bush_middle_left:             LeftMiddleBush,
        bush_left:                    LeftBush,
        soil:                         Soil,
        soil_right:                   RightSoil,
        soil_left:                    LeftSoil,
        grass_top:                    TopGrass,
        grass_top_right:              TopRightGrass,
        grass_top_left:               TopLeftGrass,
        grass_right:                  RightGrass,
        grass_left:                   LeftGrass,
        grass_top_right_rounded:      TopRightRoundedGrass,
        grass_top_left_rounded:       TopLeftRoundedGrass,
        stone:                        Stone,
        brown_block:                  BrownBlock,
        pipe_top_right:               RightTopPipe,
        pipe_top_left:                LeftTopPipe,
        pipe_right:                   RightPipe,
        pipe_left:                    LeftPipe,
        grass_top_right_corner:       TopRightCornerGrass,
        grass_top_left_corner:        TopLeftCornerGrass,
        coin:                         Coin,
        coinbox:                      CoinBox,
        multiple_coinbox:             MultipleCoinBox,
        starbox:                      StarBox,
        mushroombox:                  MushroomBox
    };

    var level = new Level('world', controls);
    level.load(levelData, assets);

    if (sounds)
        level.setSounds(sounds);

    level.start();
}