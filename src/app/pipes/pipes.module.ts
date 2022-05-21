import { NgModule } from '@angular/core';
import { SearchPipe } from './search.pipe';
import { PlayersPipe } from './players.pipe';
import { DoublePipe } from './double.pipe';

@NgModule({
	declarations: [SearchPipe, PlayersPipe, DoublePipe],
	imports: [],
	exports: [SearchPipe, PlayersPipe, DoublePipe]
})
export class PipesModule {}
