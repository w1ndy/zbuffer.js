import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Vec4 } from '../types/linalg.type';
import { ModelDesc, Model } from '../types/model.type';

@Injectable()
export class LoaderService {
    private ModelDescUrl: string = 'data/desc.json';

    private modelLoadedSource = new Subject<Model>();
    modelLoaded$ = this.modelLoadedSource.asObservable();

    constructor (private http: Http) {}

    getModelDescriptions(): Observable<ModelDesc[]> {
        return this.http
                .get(this.ModelDescUrl)
                .map((resp: Response) => resp.json())
                .catch(this.handleError);
    }

    loadModel(desc: ModelDesc): Observable<Model> {
        return this.http.get(desc.path)
                .map((resp: Response) => {
                    const m = this.processModel(desc, resp.text());
                    this.modelLoadedSource.next(m);
                    return m;
                })
                .catch(this.handleError);
    }

    processModel(desc: ModelDesc, data: string): Model {
        let m: Model = { vertices: [], faces: [], desc: desc };
        for (let l of data.split(/[\r]{0,1}\n/)) {
            if (!l.length) continue;
            const cmd = l.split(/\s+/);
            if (cmd.length < 4) continue;
            switch (cmd[0]) {
                case 'v':
                    m.vertices.push(new Vec4(parseFloat(cmd[1]), parseFloat(cmd[2]), parseFloat(cmd[3]), 1.));
                    break;
                case 'f':
                    const start = parseInt(cmd[1]) - 1;
                    for (let i = 3; i < cmd.length; i++) {
                        m.faces.push({
                            v1: start,
                            v2: parseInt(cmd[i - 1]) - 1,
                            v3: parseInt(cmd[i]) - 1
                        });
                    }
                    break;
                default:
                    console.log('unrecognized command ' + cmd[0]);
            }
        }
        return m;
    }

    private handleError(error: Response | any) {
        let errMsg: string
        if (error instanceof Response) {
            errMsg = `${error.status} - ${error.statusText || ''}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
