/*import { addProviders, inject } from '@angular/core/testing';
import { AppService } from 'app/app.service';*/

import {rateServiceRest} from '../../src/app/rate_service_rest'

describe('Rate Service Rest', () => {

    it('should set refresh period', () => {
        expect(rateServiceRest.setRefreshPeriod(-5000)).toBe(false);
        expect(rateServiceRest.setRefreshPeriod(5000)).toBe(true);
        expect(rateServiceRest.setRefreshPeriod(1000)).toBe(true);
        expect(rateServiceRest.setRefreshPeriod("1000")).toBe(true);
        expect(rateServiceRest.setRefreshPeriod(1000)).toBe(true);

        //rateServiceRest.fireUpdate = jasmine.createSpy("fireUpdate()", spy);
    });

    it('should call fireUpdate', (done) => {
        spyOn(rateServiceRest, "_fireUpdate");
        expect(rateServiceRest.setRefreshPeriod(1000)).toBe(true);
        setTimeout(function () {            
            expect(rateServiceRest._fireUpdate).toHaveBeenCalled();
            done();
        }, 1500);
    }, 2000);
});