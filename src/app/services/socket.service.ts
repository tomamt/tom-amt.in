import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { EnvironmentService } from '../../environments/environment.service';

@Injectable({ 
    providedIn: 'root'
})
export class SocketService {

    url;
    socket;
    subject = new Subject<any>();

    constructor(private envService: EnvironmentService) {
        this.url = this.envService.read('socketURL');

    }

    connect() {
        var jwt = localStorage.getItem('header-token');
        var opts = {
          path: '/ws',
          transports: ['websocket']
        };
        this.socket = io.connect(this.url, opts);
        this.socket.on('connect_error', onError );
        this.socket.on('reconnect_error', onError );
        this.socket.on('connect', (connect) => {
          this.socket
          .emit('authenticate', { token: jwt })
          .on('authenticated', () => {
            
          })
          .on('unauthorized', (msg) => {
            throw new Error(msg.data.type);
          })

      });
        
        function onError(message)
        {
           console.log('<span style="color: red;">ERROR:</span> ' + message);
        }
        
        this.socket.on('disconnect', (disconnect) => {
           // console.log('disconnect', disconnect);
        });
        
    }

    disconnect() {
        this.socket.close();
    }

    getNotification(): Observable<any> {
        return Observable.create((observer) => {
            
            this.socket.on("new-order", data => {
                observer.next(data);
              });
              this.socket.on("order-fired", data => {
                observer.next(data);
              });
               this.socket.on("order-ready", data => {
                observer.next(data);
              });
              this.socket.on("order-pickedup", data => {
                observer.next(data);
              });
              this.socket.on("order-arrived", data => {
                observer.next(data);
              });
              this.socket.on("order-delivered", data => {
                observer.next(data);
              });
              this.socket.on("order-cancelled", data => {
                observer.next(data);
              });
              this.socket.on("order-crew-issue", data => {
                observer.next(data);
              });
              this.socket.on("order-da-issue", data => {
                observer.next(data);
              });
        });
    }

    getPaymentList(): Observable<any> {
      return Observable.create((observer) => {
          
          this.socket.on("payments", data => {
              observer.next(data);
            });
      });
    }

    getMessageAlert(): Observable<any> {
        return Observable.create((observer) => {
          this.socket.on("alert-da-issue", data => {
            observer.next(data);
          });
          
         
        });
    }

    getcrewIssue(): Observable<any> {
        return Observable.create((observer) => {
          this.socket.on("alert-crew-issue", data => {
            observer.next(data);
          });
        });
    }

    getDABreakIssue(): Observable<any> {
        return Observable.create(observer => {
          this.socket.on("da-break", data => {
            observer.next(data);
          });
        });
    }

    getrecipientCancellations(): Observable<any> {
      return Observable.create(observer => {
        this.socket.on("alert-consumer-issue", data => {
          observer.next(data);
        });
      });
  }

   
}
